<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;
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
    ];

    protected function casts(): array
    {
        return [
            'antecedentes' => 'array',
            'antecedentes_oftalmologicos' => 'array',
            'exploracion_fisica' => 'array',
            'estrabograma' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
