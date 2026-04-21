<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppointmentsTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_fetch_appointments_as_json()
    {
        $user = User::factory()->create();
        $patient = Patient::factory()->create(); // Assumes PatientFactory exists

        Appointment::create([
            'user_id' => $user->id,
            'patient_id' => $patient->id,
            'title' => 'Test Appointment',
            'starts_at' => now()->addDays(1),
            'ends_at' => now()->addDays(1)->addHours(1),
        ]);

        $response = $this->actingAs($user)->getJson('/appointments');

        $response->assertStatus(200)
                 ->assertJsonCount(1)
                 ->assertJsonPath('0.title', 'Test Appointment')
                 ->assertJsonStructure([
                     '*' => ['id', 'patient_id', 'title', 'starts_at', 'ends_at', 'patient' => ['id', 'first_name', 'last_name']]
                 ]);
    }

    public function test_can_create_appointment()
    {
        $user = User::factory()->create();
        $patient = Patient::factory()->create();

        $payload = [
            'patient_id' => $patient->id,
            'title' => 'New Checkup',
            'starts_at' => now()->addDays(2)->toDateTimeString(),
            'ends_at' => now()->addDays(2)->addHours(2)->toDateTimeString(),
            'notes' => 'Some notes here',
        ];

        // Setting previous URL so back() redirects appropriately
        $this->from('/appointments');

        $response = $this->actingAs($user)->post('/appointments', $payload);

        $response->assertRedirect('/appointments');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('appointments', [
            'user_id' => $user->id,
            'patient_id' => $patient->id,
            'title' => 'New Checkup',
            'notes' => 'Some notes here',
        ]);
    }

    public function test_can_update_appointment()
    {
        $user = User::factory()->create();
        $patient = Patient::factory()->create();

        $appointment = Appointment::create([
            'user_id' => $user->id,
            'patient_id' => $patient->id,
            'title' => 'Old Title',
            'starts_at' => now()->addDays(1),
            'ends_at' => now()->addDays(1)->addHours(1),
        ]);

        $payload = [
            'title' => 'Updated Title',
            'starts_at' => now()->addDays(3)->toDateTimeString(),
            'ends_at' => now()->addDays(3)->addHours(2)->toDateTimeString(),
        ];

        $this->from('/appointments');

        $response = $this->actingAs($user)->put('/appointments/' . $appointment->id, $payload);

        $response->assertRedirect('/appointments');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_cannot_update_other_users_appointment()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $patient = Patient::factory()->create();

        $appointment = Appointment::create([
            'user_id' => $otherUser->id,
            'patient_id' => $patient->id,
            'title' => 'Other Title',
            'starts_at' => now()->addDays(1),
            'ends_at' => now()->addDays(1)->addHours(1),
        ]);

        $response = $this->actingAs($user)->put('/appointments/' . $appointment->id, [
            'title' => 'Hacked Title'
        ]);

        $response->assertStatus(403);
    }

    public function test_can_delete_appointment()
    {
        $user = User::factory()->create();
        $patient = Patient::factory()->create();

        $appointment = Appointment::create([
            'user_id' => $user->id,
            'patient_id' => $patient->id,
            'title' => 'To be deleted',
            'starts_at' => now()->addDays(1),
            'ends_at' => now()->addDays(1)->addHours(1),
        ]);

        $this->from('/appointments');

        $response = $this->actingAs($user)->delete('/appointments/' . $appointment->id);

        $response->assertRedirect('/appointments');
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('appointments', [
            'id' => $appointment->id,
        ]);
    }

    public function test_cannot_delete_other_users_appointment()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $patient = Patient::factory()->create();

        $appointment = Appointment::create([
            'user_id' => $otherUser->id,
            'patient_id' => $patient->id,
            'title' => 'Important',
            'starts_at' => now()->addDays(1),
            'ends_at' => now()->addDays(1)->addHours(1),
        ]);

        $response = $this->actingAs($user)->delete('/appointments/' . $appointment->id);

        $response->assertStatus(403);
        
        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
        ]);
    }
}
