<?php

namespace App\Rules;

use App\Support\EmailAllowlist;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Fails unless the email is on the allowlist stored under the given config
 * key (registration is gated by 'registration.allowed_emails'). An empty
 * allowlist allows nobody, so registration stays closed until configured.
 */
class EmailAllowlisted implements ValidationRule
{
    public function __construct(
        private string $configKey = 'registration.allowed_emails',
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || ! EmailAllowlist::fromConfig($this->configKey)->allows($value)) {
            $fail('Este correo no está autorizado para registrarse. Contacta al administrador.');
        }
    }
}
