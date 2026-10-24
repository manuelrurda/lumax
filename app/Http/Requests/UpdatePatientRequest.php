<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Names are only required when present: clinical-section saves
            // (one PUT per record tab) must not have to resend the whole
            // patient just to satisfy identity validation.
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'last_name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'regex:/^[0-9]+$/', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'antecedentes' => ['nullable', 'array'],
            'antecedentes_oftalmologicos' => ['nullable', 'array'],
            'exploracion_fisica' => ['nullable', 'array'],
            'estrabograma' => ['nullable', 'array'],
            // NOTE (issue #5): do NOT add nested rules like
            // 'estrabograma.shapes' here. validated() prunes array keys
            // that have no rule, so nested rules would silently drop
            // `observaciones` and the legacy campo_* keys on every save.
            // The whole section array is accepted as-is, like the other
            // clinical sections; canvas `shapes` ride inside it.
            'refraccion' => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.email' => 'Por favor, ingrese un correo electrónico válido.',
            'phone.regex' => 'El teléfono solo debe contener números.',
        ];
    }
}
