<?php

namespace App\Http\Requests;

use App\Models\BugReport;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBugReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in([BugReport::TYPE_BUG, BugReport::TYPE_MEJORA])],
            'description' => ['required', 'string', 'min:3', 'max:5000'],
            'page_path' => ['required', 'string', 'max:1024'],
            'page_url' => ['nullable', 'string', 'max:2048'],
            'page_component' => ['nullable', 'string', 'max:255'],
            'viewport' => ['nullable', 'string', 'max:32'],
            'screenshot' => ['nullable', 'file', 'image', 'max:8192'],
            'attachments' => ['nullable', 'array', 'max:4'],
            'attachments.*' => ['file', 'mimes:jpg,jpeg,png,gif,webp,pdf', 'max:8192'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'description.required' => 'La descripción es obligatoria.',
            'description.min' => 'Describe el problema con un poco más de detalle (mínimo 3 caracteres).',
            'description.max' => 'La descripción no puede exceder 5000 caracteres.',
            'type.in' => 'El tipo de reporte no es válido.',
            'attachments.max' => 'Puedes adjuntar máximo 4 archivos.',
            'attachments.*.max' => 'Cada archivo adjunto puede pesar máximo 8 MB.',
            'attachments.*.mimes' => 'Solo se permiten imágenes o archivos PDF.',
            'screenshot.max' => 'La captura de pantalla es demasiado grande (máximo 8 MB).',
            'screenshot.image' => 'La captura de pantalla debe ser una imagen.',
        ];
    }
}
