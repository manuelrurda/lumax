<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Minimal server-side client for the UploadThing v6 API.
 *
 * Flow (per https://docs.uploadthing.com/api-reference/openapi-spec):
 *  1. POST /v6/uploadFiles with the file metadata -> returns a presigned
 *     upload URL and the file key for each file.
 *  2. PUT the binary contents to the presigned URL.
 *  3. Poll GET /v6/pollUpload/{key} until the file status is done.
 *
 * Only used for bug report attachments (screenshots + user files). The whole
 * feature degrades gracefully when no token is configured: see configured().
 */
class UploadThingService
{
    private const API_BASE = 'https://api.uploadthing.com/v6';

    private const API_VERSION = '6.4.0';

    private const POLL_ATTEMPTS = 5;

    private const POLL_DELAY_MS = 400;

    public function configured(): bool
    {
        return filled(config('services.uploadthing.token'));
    }

    /**
     * Upload a file and return its public URL plus metadata.
     *
     * @return array{url: string, key: string, name: string, size: int, type: ?string}
     *
     * @throws UploadThingException
     */
    public function upload(UploadedFile|string $file, ?string $filename = null, ?string $mime = null): array
    {
        if (! $this->configured()) {
            throw new UploadThingException('UploadThing no está configurado (falta UPLOADTHING_TOKEN).');
        }

        if ($file instanceof UploadedFile) {
            $contents = file_get_contents($file->getRealPath());
            $filename ??= $file->getClientOriginalName();
            $mime ??= $file->getClientMimeType();
            $size = $file->getSize();
        } else {
            $contents = $file;
            $size = strlen($contents);
        }

        if ($contents === false || $filename === null) {
            throw new UploadThingException('No se pudo leer el archivo a subir.');
        }

        try {
            $presign = Http::withHeaders($this->headers())
                ->acceptJson()
                ->post(self::API_BASE.'/uploadFiles', [
                    'files' => [[
                        'name' => $filename,
                        'size' => $size,
                        'type' => $mime,
                        'customId' => null,
                    ]],
                    'metadata' => new \stdClass,
                    'contentDisposition' => 'inline',
                    'acl' => 'public-read',
                ]);
        } catch (ConnectionException $e) {
            throw new UploadThingException('No se pudo contactar a UploadThing.', previous: $e);
        }

        if ($presign->failed()) {
            Log::warning('UploadThing uploadFiles failed', ['status' => $presign->status(), 'body' => $presign->body()]);
            throw new UploadThingException('UploadThing rechazó la solicitud de subida.');
        }

        $fileData = $presign->json('data.0');
        $url = $fileData['url'] ?? $fileData['urls']['url'] ?? null;
        $key = $fileData['key'] ?? $fileData['fileKey'] ?? null;

        if (! $url || ! $key) {
            throw new UploadThingException('Respuesta inesperada de UploadThing al preparar la subida.');
        }

        try {
            $put = Http::withBody($contents, $mime ?? 'application/octet-stream')->put($url);
        } catch (ConnectionException $e) {
            throw new UploadThingException('No se pudo subir el archivo a UploadThing.', previous: $e);
        }

        if ($put->failed()) {
            Log::warning('UploadThing presigned PUT failed', ['status' => $put->status()]);
            throw new UploadThingException('La subida del archivo a UploadThing falló.');
        }

        $fileUrl = $this->pollUntilDone($key, $fileData['fileUrl'] ?? null);

        return [
            'url' => $fileUrl,
            'key' => $key,
            'name' => $filename,
            'size' => $size,
            'type' => $mime,
        ];
    }

    /**
     * Poll the file status until UploadThing reports it as done.
     *
     * @throws UploadThingException
     */
    private function pollUntilDone(string $key, ?string $fallbackUrl = null): string
    {
        for ($attempt = 0; $attempt < self::POLL_ATTEMPTS; $attempt++) {
            try {
                $response = Http::withHeaders($this->headers())
                    ->acceptJson()
                    ->get(self::API_BASE.'/pollUpload/'.$key);
            } catch (ConnectionException) {
                $response = null;
            }

            if ($response && $response->successful()) {
                $status = $response->json('status');

                if ($status === 'done') {
                    return $response->json('fileData.fileUrl')
                        ?? $response->json('fileData.url')
                        ?? $fallbackUrl
                        ?? 'https://utfs.io/f/'.$key;
                }

                if (in_array($status, ['failed', 'error'], true)) {
                    throw new UploadThingException('UploadThing no pudo procesar el archivo subido.');
                }
            }

            if ($attempt < self::POLL_ATTEMPTS - 1) {
                usleep(self::POLL_DELAY_MS * 1000);
            }
        }

        // The bytes are already stored; if polling times out we can still
        // reference the file by its deterministic utfs URL.
        return $fallbackUrl ?? 'https://utfs.io/f/'.$key;
    }

    /**
     * @return array<string, string>
     */
    private function headers(): array
    {
        return [
            'x-uploadthing-api-key' => (string) config('services.uploadthing.token'),
            'x-uploadthing-version' => self::API_VERSION,
        ];
    }
}
