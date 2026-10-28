<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class Patient extends Model
{
    use HasFactory, LogsActivity, SoftDeletes;
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

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
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

    /**
     * Merge a full snapshot of the clinical sections into every update
     * activity; the history read-only replay renders from it.
     *
     * NOTE: this hook was named tapActivity() until the installed
     * spatie/activitylog major renamed it to beforeActivityLogged() —
     * under the old name it was silently never called and snapshots
     * were stored empty (found via issue #5's snapshot test).
     */
    public function beforeActivityLogged(Activity $activity, string $eventName)
    {
        if ($eventName === 'updated') {
            $activity->properties = $activity->properties->merge([
                'snapshot' => [
                    'antecedentes' => $this->antecedentes,
                    'antecedentes_oftalmologicos' => $this->antecedentes_oftalmologicos,
                    'exploracion_fisica' => $this->exploracion_fisica,
                    'estrabograma' => $this->estrabograma,
                    'refraccion' => $this->refraccion,
                ]
            ]);
        }
    }
}
