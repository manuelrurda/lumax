<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BugReportAttachment extends Model
{
    public const KIND_SCREENSHOT = 'screenshot';

    public const KIND_ATTACHMENT = 'attachment';

    protected $fillable = [
        'bug_report_id',
        'kind',
        'file_url',
        'file_name',
        'file_type',
        'file_size',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
        ];
    }

    public function bugReport(): BelongsTo
    {
        return $this->belongsTo(BugReport::class);
    }
}
