<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class PatientOftalmologicosFormTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_oftalmologicos_form_page(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        $response = $this->actingAs($user)->get(route('patients.oftalmologicos', $patient->id));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('patients/records/oftalmologicos')
            ->has('patient')
        );
    }

    public function test_authenticated_user_can_update_patient_oftalmologicos_data(): void
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
            'antecedentes_oftalmologicos' => [
                'lentes_aereos' => [
                    'ultima_refraccion' => 'O.D. -3.00, O.S. -2.50',
                    'gotas' => 'Gotas lubricantes c/4h',
                    'cirugias_previas' => 'Ninguna',
                    'glaucoma' => 'No',
                ],
                'lentes_contacto' => [
                    'blandos' => true,
                    'rigidos' => false,
                    'ultima_refraccion' => 'O.D. -2.75',
                    'trauma_ocular' => 'No',
                    'laser' => 'No',
                    'otros' => 'Ninguno',
                ],
            ],
        ];

        $response = $this->actingAs($user)
            ->from(route('patients.oftalmologicos', $patient->id))
            ->put(route('patients.update', $patient->id), $formData);

        $response->assertRedirect(route('patients.oftalmologicos', $patient->id));
        $response->assertSessionHas('message', 'Paciente actualizado exitosamente.');

        $this->assertDatabaseHas('patients', [
            'id' => $patient->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        $updatedPatient = Patient::find($patient->id);
        $this->assertNotNull($updatedPatient->antecedentes_oftalmologicos);
        $this->assertEquals('Gotas lubricantes c/4h', $updatedPatient->antecedentes_oftalmologicos['lentes_aereos']['gotas']);
        $this->assertEquals(true, $updatedPatient->antecedentes_oftalmologicos['lentes_contacto']['blandos']);
        $this->assertEquals(false, $updatedPatient->antecedentes_oftalmologicos['lentes_contacto']['rigidos']);
    }

    public function test_validation_fails_with_invalid_oftalmologicos_data(): void
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
            'antecedentes_oftalmologicos' => 'not-an-array-invalid-value',
        ];

        $response = $this->actingAs($user)
            ->put(route('patients.update', $patient->id), $formData);

        $response->assertSessionHasErrors(['antecedentes_oftalmologicos']);
    }

    public function test_user_cannot_update_other_users_patient_oftalmologicos(): void
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
            'antecedentes_oftalmologicos' => [
                'lentes_aereos' => [
                    'ultima_refraccion' => 'O.D. -1.00',
                ],
            ],
        ];

        $response = $this->actingAs($user)
            ->put(route('patients.update', $patient->id), $formData);

        $response->assertStatus(403);
    }
}
