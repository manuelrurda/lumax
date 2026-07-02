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
                'od_av_sin_opt1' => 'snellen_20ft',
                'od_av_sin_opt2' => '20/40',
                'od_av_sin_input' => 'PH 20/20',
                'od_av_con_opt1' => 'snellen_20ft',
                'od_av_con_opt2' => '20/20',
                'od_av_con_input' => '',
                
                'od_quera_1' => '44.50',
                'od_quera_2' => '45.00',
                'od_quera_3' => '90',
                'od_retino_1' => '-1.50',
                'od_retino_2' => '-0.50',
                'od_retino_3' => '180',
                'od_retino_4' => '',
                
                'od_adicion' => '+1.50',
                'od_distancia' => '62',
                
                'oi_av_sin_opt1' => 'snellen_20ft',
                'oi_av_sin_opt2' => '20/50',
                'oi_av_sin_input' => '',
                'oi_av_con_opt1' => 'snellen_20ft',
                'oi_av_con_opt2' => '20/25',
                'oi_av_con_input' => '',
                
                'oi_quera_1' => '44.25',
                'oi_quera_2' => '45.25',
                'oi_quera_3' => '95',
                
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
        $this->assertEquals('snellen_20ft', $updatedPatient->refraccion['od_av_sin_opt1']);
        $this->assertEquals('20/40', $updatedPatient->refraccion['od_av_sin_opt2']);
        $this->assertEquals('PH 20/20', $updatedPatient->refraccion['od_av_sin_input']);
        $this->assertEquals('44.50', $updatedPatient->refraccion['od_quera_1']);
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
