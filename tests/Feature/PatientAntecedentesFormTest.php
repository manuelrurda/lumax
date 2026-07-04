<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class PatientAntecedentesFormTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_antecedentes_form_page(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        $response = $this->actingAs($user)->get(route('patients.antecedentes', $patient->id));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('patients/records/antecedentes')
            ->has('patient')
        );
    }

    public function test_authenticated_user_can_update_patient_antecedentes_heredofamiliares_data(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'phone' => '1234567890',
            'email' => 'john@example.com',
        ]);

        $formData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'phone' => '1234567890',
            'email' => 'john@example.com',
            'antecedentes' => [
                'antecedentes_no_patologicos' => [
                    'ocupacion' => 'Ninguna',
                    'religion' => 'Ninguna',
                    'tipo_sangre' => '',
                    'fuma' => 'no',
                    'toma' => 'no',
                    'transfusiones' => 'no',
                    'psicotropicos' => 'Ninguno',
                    'alergias' => 'Ninguna',
                    'perinatales' => 'Ninguno',
                    'medicamentos_actuales' => 'Ninguno',
                    'otros' => [],
                ],
                'antecedentes_patologicos' => [
                    'diabetes' => ['padece' => 'no', 'tiempo_evolucion' => ''],
                    'hipertension' => ['padece' => 'no', 'tiempo_evolucion' => ''],
                    'enfermedades_corazon' => ['padece' => 'no', 'tiempo_evolucion' => ''],
                    'cancer' => ['padece' => 'no', 'tiempo_evolucion' => ''],
                    'epilepsia' => ['padece' => 'no', 'tiempo_evolucion' => ''],
                    'otros' => [],
                ],
                'antecedentes_heredofamiliares' => [
                    'diabetes' => [
                        'padece' => 'sí',
                        'parentesco' => 'Madre',
                    ],
                    'hipertension' => [
                        'padece' => 'no',
                        'parentesco' => '',
                    ],
                    'cancer' => [
                        'padece' => 'sí',
                        'parentesco' => 'Abuelo paterno',
                    ],
                    'glaucoma' => [
                        'padece' => 'no',
                        'parentesco' => '',
                    ],
                    'otros' => [
                        [
                            'key' => 'Asma',
                            'parentesco' => 'Hermano',
                        ],
                    ],
                ],
            ],
        ];

        $response = $this->actingAs($user)
            ->from(route('patients.antecedentes', $patient->id))
            ->put(route('patients.update', $patient->id), $formData);

        $response->assertRedirect(route('patients.antecedentes', $patient->id));
        $response->assertSessionHas('message', 'Paciente actualizado exitosamente.');

        $this->assertDatabaseHas('patients', [
            'id' => $patient->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        $updatedPatient = Patient::find($patient->id);
        $this->assertNotNull($updatedPatient->antecedentes);
        
        $heredo = $updatedPatient->antecedentes['antecedentes_heredofamiliares'];
        $this->assertEquals('sí', $heredo['diabetes']['padece']);
        $this->assertEquals('Madre', $heredo['diabetes']['parentesco']);
        $this->assertEquals('no', $heredo['hipertension']['padece']);
        $this->assertEquals('sí', $heredo['cancer']['padece']);
        $this->assertEquals('Abuelo paterno', $heredo['cancer']['parentesco']);
        $this->assertEquals('Asma', $heredo['otros'][0]['key']);
        $this->assertEquals('Hermano', $heredo['otros'][0]['parentesco']);
    }

    public function test_validation_fails_with_invalid_antecedentes_data(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        $formData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'antecedentes' => 'not-an-array-invalid-value',
        ];

        $response = $this->actingAs($user)
            ->put(route('patients.update', $patient->id), $formData);

        $response->assertSessionHasErrors(['antecedentes']);
    }

    public function test_user_cannot_update_other_users_patient_antecedentes(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $otherUser->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        $formData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'antecedentes' => [
                'antecedentes_heredofamiliares' => [
                    'diabetes' => [
                        'padece' => 'sí',
                        'parentesco' => 'Madre',
                    ],
                ],
            ],
        ];

        $response = $this->actingAs($user)
            ->put(route('patients.update', $patient->id), $formData);

        $response->assertStatus(403);
    }
}
