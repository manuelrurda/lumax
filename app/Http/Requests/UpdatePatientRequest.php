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
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'regex:/^[0-9]+$/', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'antecedentes' => ['nullable', 'array'],
            'antecedentes_oftalmologicos' => ['nullable', 'array'],
            'exploracion_fisica' => ['nullable', 'array'],
            'estrabograma' => ['nullable', 'array'],
            'exploracion_oftalmologica' => ['nullable', 'array'],
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
