<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'antecedentes',
    ];

    protected function casts(): array
    {
        return [
            'antecedentes' => 'array',
        ];
    }
}
