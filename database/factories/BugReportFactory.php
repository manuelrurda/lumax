<?php

namespace Database\Factories;

use App\Models\BugReport;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BugReport>
 */
class BugReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $descriptions = [
            'Al guardar la refracción de un paciente, la página tarda mucho en responder.',
            'Quiero poder copiar los valores del ojo derecho al izquierdo con un botón.',
            'El calendario de citas no muestra las citas de la próxima semana al cambiar de vista.',
            'Sería útil exportar el historial del paciente en PDF para imprimirlo.',
            'El buscador de pacientes no encuentra resultados cuando el apellido lleva acento.',
        ];

        $description = fake()->randomElement($descriptions);

        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement([BugReport::TYPE_BUG, BugReport::TYPE_MEJORA]),
            'title' => Str::limit($description, 80, ''),
            'description' => $description,
            'page_path' => fake()->randomElement(['/patients', '/patients/1/refraccion', '/appointments', '/patients/1']),
            'page_url' => null,
            'page_component' => fake()->randomElement(['patients/index', 'patients/records/refraccion', 'appointments/index']),
            'user_agent' => fake()->userAgent(),
            'viewport' => fake()->randomElement(['1440x900', '1920x1080', '390x844']),
            'status' => BugReport::STATUS_NUEVO,
        ];
    }
}
