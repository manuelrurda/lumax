<?php

namespace App\Mail;

use App\Models\Document;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class DocumentReceivedNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $sender;
    public $document;
    public $url;
    public $customMessage;
    public $recipient;

    /**
     * Create a new message instance.
     */
    public function __construct(User $sender, Document $document, string $url, ?string $customMessage = null, ?User $recipient = null)
    {
        $this->sender = $sender;
        $this->document = $document;
        $this->url = $url;
        $this->customMessage = $customMessage;
        $this->recipient = $recipient;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Documento Recibido',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.document_received_notification',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    /**
     * Handle a job failure.
     *
     * @param  \Throwable  $exception
     * @return void
     */
    public function failed(Throwable $exception): void
    {
        Log::error('Failed to send DocumentReceivedNotification email', [
            'document_id' => $this->document->id ?? null,
            'document_name' => $this->document->original_file_name ?? null,
            'sender_id' => $this->sender->id ?? null,
            'sender_email' => $this->sender->email ?? null,
            'url' => $this->url ?? null,
            'error' => $exception->getMessage(),
            'error_code' => method_exists($exception, 'getCode') ? $exception->getCode() : null,
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
