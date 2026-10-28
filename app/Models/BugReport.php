<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BugReport extends Model
{
    /** @use HasFactory<\Database\Factories\BugReportFactory> */
    use HasFactory;

    public const TYPE_BUG = 'bug';

    public const TYPE_MEJORA = 'mejora';

    public const STATUS_NUEVO = 'nuevo';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'description',
        'page_path',
        'page_url',
        'page_component',
        'user_agent',
        'viewport',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(BugReportAttachment::class);
    }
}
