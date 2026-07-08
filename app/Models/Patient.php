<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Patient extends Model
{
    use HasFactory, LogsActivity;
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'antecedentes',
        'antecedentes_oftalmologicos',
        'exploracion_fisica',
        'estrabograma',
        'refraccion',
    ];

    protected function casts(): array
    {
        return [
            'antecedentes' => 'array',
            'antecedentes_oftalmologicos' => 'array',
            'exploracion_fisica' => 'array',
            'estrabograma' => 'array',
            'refraccion' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly([
                'antecedentes',
                'antecedentes_oftalmologicos',
                'exploracion_fisica',
                'estrabograma',
                'refraccion',
            ])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }
}
