<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Minimal server-side client for the UploadThing v7 API.
 *
 * The configured UPLOADTHING_TOKEN is the v7 token from the dashboard: a
 * base64-encoded JSON object ({apiKey, appId, regions}). The REST API
 * authenticates with the raw apiKey inside it, so it is extracted here.
 * (Verified against the live API on 2026-10-26 — the v6 endpoints reject
 * current apps with "Unsupported operation".)
 *
 * Flow (server-side uploads):
 *  1. POST /v7/prepareUpload with one file's metadata -> returns a signed
 *     ingest URL and the file key.
 *  2. PUT the file to the signed URL as multipart/form-data (field "file"),
 *     exactly like the official JS client; the response is synchronous and
 *     contains the final file URL (ufsUrl). There is no polling step in v7.
 *
 * Only used for bug report attachments (screenshots + user files). The whole
 * feature degrades gracefully when no token is configured: see configured().
 */
class UploadThingService
{
    private const API_BASE = 'https://api.uploadthing.com/v7';

    public function configured(): bool
    {
        return filled($this->apiKey());
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

        // Attach a stream for real files: Laravel's multipart builder drops
        // empty-string contents, which breaks zero-byte (or fake) files.
        $stream = null;

        if ($file instanceof UploadedFile) {
            $filename ??= $file->getClientOriginalName();
            $mime ??= $file->getClientMimeType();
            $size = $file->getSize();
            $stream = fopen($file->getRealPath(), 'r');
            $contents = $stream;
        } else {
            $contents = $file;
            $size = strlen($contents);
        }

        if ($contents === false || $contents === null || $filename === null) {
            throw new UploadThingException('No se pudo leer el archivo a subir.');
        }

        try {
            $prepare = Http::withHeaders($this->headers())
                ->acceptJson()
                ->post(self::API_BASE.'/prepareUpload', [
                    'fileName' => $filename,
                    'fileSize' => $size,
                    'fileType' => $mime,
                    'metadata' => new \stdClass,
                    'contentDisposition' => 'inline',
                    'acl' => 'public-read',
                ]);
        } catch (ConnectionException $e) {
            throw new UploadThingException('No se pudo contactar a UploadThing.', previous: $e);
        }

        if ($prepare->failed()) {
            Log::warning('UploadThing prepareUpload failed', ['status' => $prepare->status(), 'body' => $prepare->body()]);
            throw new UploadThingException('UploadThing rechazó la solicitud de subida.');
        }

        $url = $prepare->json('url');
        $key = $prepare->json('key');

        if (! $url || ! $key) {
            throw new UploadThingException('Respuesta inesperada de UploadThing al preparar la subida.');
        }

        try {
            $put = Http::attach('file', $contents, $filename, ['Content-Type' => $mime ?? 'application/octet-stream'])
                ->withHeaders(['Range' => 'bytes=0-'])
                ->put($url);
        } catch (ConnectionException $e) {
            throw new UploadThingException('No se pudo subir el archivo a UploadThing.', previous: $e);
        }

        if ($put->failed()) {
            Log::warning('UploadThing ingest PUT failed', ['status' => $put->status(), 'body' => $put->body()]);
            throw new UploadThingException('La subida del archivo a UploadThing falló.');
        }

        $fileUrl = $put->json('ufsUrl') ?? $put->json('url') ?? 'https://utfs.io/f/'.$key;

        return [
            'url' => $fileUrl,
            'key' => $key,
            'name' => $filename,
            'size' => $size,
            'type' => $mime,
        ];
    }

    /**
     * The v7 token is base64 JSON carrying the apiKey; a raw sk_ key (the
     * dashboard's V6 tab) is also accepted as-is.
     */
    private function apiKey(): ?string
    {
        $token = (string) config('services.uploadthing.token');

        if ($token === '') {
            return null;
        }

        $decoded = base64_decode($token, true);
        $json = $decoded !== false ? json_decode($decoded, true) : null;

        if (is_array($json) && filled($json['apiKey'] ?? null)) {
            return (string) $json['apiKey'];
        }

        return $token;
    }

    /**
     * @return array<string, string>
     */
    private function headers(): array
    {
        return [
            'x-uploadthing-api-key' => (string) $this->apiKey(),
        ];
    }
}
