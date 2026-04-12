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
    ];

    protected function casts(): array
    {
        return [
            'antecedentes' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
