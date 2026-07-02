<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class PatientRefraccionFormTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_refraccion_form_page(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'Gregory',
            'last_name' => 'House',
        ]);

        $response = $this->actingAs($user)->get(route('patients.refraccion', $patient->id));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('patients/records/refraccion')
            ->has('patient')
        );
    }

    public function test_authenticated_user_can_update_patient_refraccion_data(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'Gregory',
            'last_name' => 'House',
            'phone' => '1234567890',
            'email' => 'house@example.com',
        ]);

        $formData = [
            'first_name' => 'Gregory',
            'last_name' => 'House',
            'phone' => '1234567890',
            'email' => 'house@example.com',
            'refraccion' => [
                'od_sin_quera_1' => '20/40',
                'od_sin_quera_2' => '20/30',
                'od_sin_quera_3' => '20/20',
                'od_con_quera_1' => '20/20',
                'od_con_quera_2' => '20/20',
                'od_con_quera_3' => '20/20',
                'od_adicion' => '+1.50',
                'od_distancia' => '62',
                'oi_sin_quera_1' => '20/50',
                'oi_sin_quera_2' => '20/40',
                'oi_sin_quera_3' => '20/30',
                'oi_con_quera_1' => '20/25',
                'oi_con_quera_2' => '20/20',
                'oi_con_quera_3' => '20/20',
                'oi_adicion' => '+1.50',
                'oi_distancia' => '62',
                'comentarios' => 'Paciente presenta leve mejoría con graduación temporal.',
            ],
        ];

        $response = $this->actingAs($user)
            ->from(route('patients.refraccion', $patient->id))
            ->put(route('patients.update', $patient->id), $formData);

        $response->assertRedirect(route('patients.refraccion', $patient->id));
        $response->assertSessionHas('message', 'Paciente actualizado exitosamente.');

        $this->assertDatabaseHas('patients', [
            'id' => $patient->id,
            'first_name' => 'Gregory',
            'last_name' => 'House',
        ]);

        $updatedPatient = Patient::find($patient->id);
        $this->assertNotNull($updatedPatient->refraccion);
        $this->assertEquals('20/40', $updatedPatient->refraccion['od_sin_quera_1']);
        $this->assertEquals('+1.50', $updatedPatient->refraccion['od_adicion']);
        $this->assertEquals('Paciente presenta leve mejoría con graduación temporal.', $updatedPatient->refraccion['comentarios']);
    }

    public function test_validation_fails_with_invalid_refraccion_data(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'Gregory',
            'last_name' => 'House',
        ]);

        $formData = [
            'first_name' => 'Gregory',
            'last_name' => 'House',
            'refraccion' => 'string-instead-of-array-value',
        ];

        $response = $this->actingAs($user)
            ->put(route('patients.update', $patient->id), $formData);

        $response->assertSessionHasErrors(['refraccion']);
    }

    public function test_user_cannot_update_other_users_patient_refraccion(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $otherUser->id,
            'first_name' => 'Gregory',
            'last_name' => 'House',
        ]);

        $formData = [
            'first_name' => 'Gregory',
            'last_name' => 'House',
            'refraccion' => [
                'comentarios' => 'lorem ipsum',
            ],
        ];

        $response = $this->actingAs($user)
            ->put(route('patients.update', $patient->id), $formData);

        $response->assertStatus(403);
    }
}
