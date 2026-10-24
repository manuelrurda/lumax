<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatientUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_patient(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'Original First',
            'last_name' => 'Original Last',
            'phone' => '1111111111',
            'email' => 'original@ejemplo.com',
        ]);

        $response = $this->actingAs($user)->from('/patients')->put("/patients/{$patient->id}", [
            'first_name' => 'Updated First',
            'last_name' => 'Updated Last',
            'phone' => '2222222222',
            'email' => 'updated@example.com',
        ]);

        $response->assertRedirect('/patients');
        $response->assertSessionHas('message', 'Paciente actualizado exitosamente.');
        
        $this->assertDatabaseHas('patients', [
            'id' => $patient->id,
            'first_name' => 'Updated First',
            'last_name' => 'Updated Last',
            'phone' => '2222222222',
            'email' => 'updated@example.com',
        ]);
    }

    public function test_fields_are_validated_on_update(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'Original First',
            'last_name' => 'Original Last',
        ]);

        $response = $this->actingAs($user)->put("/patients/{$patient->id}", [
            'first_name' => '',
            'last_name' => '',
            'phone' => 'abc', // invalid phone format
            'email' => 'not-an-email',
        ]);

        $response->assertSessionHasErrors(['first_name', 'last_name', 'phone', 'email']);
    }

    public function test_phone_and_email_can_be_nulled_out(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'Original',
            'last_name' => 'Original',
            'phone' => '1234567890',
            'email' => 'test@ejemplo.com',
        ]);

        $response = $this->actingAs($user)->from("/patients/{$patient->id}")->put("/patients/{$patient->id}", [
            'first_name' => 'Updated',
            'last_name' => 'Updated',
            'phone' => null,
            'email' => null,
        ]);

        $response->assertRedirect("/patients/{$patient->id}");
        
        $this->assertDatabaseHas('patients', [
            'id' => $patient->id,
            'phone' => null,
            'email' => null,
        ]);
    }
    
    public function test_section_only_update_without_names_succeeds(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'Original First',
            'last_name' => 'Original Last',
        ]);

        $response = $this->actingAs($user)->from("/patients/{$patient->id}/refraccion")->put("/patients/{$patient->id}", [
            'refraccion' => ['od_esfera' => '-1.25', 'oi_esfera' => '-1.00'],
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('message', 'Paciente actualizado exitosamente.');

        $patient->refresh();
        $this->assertSame('Original First', $patient->first_name);
        $this->assertSame('Original Last', $patient->last_name);
        $this->assertSame('-1.25', $patient->refraccion['od_esfera']);
    }

    public function test_update_with_explicitly_empty_first_name_still_fails(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'Original First',
            'last_name' => 'Original Last',
        ]);

        $response = $this->actingAs($user)->put("/patients/{$patient->id}", [
            'first_name' => '',
        ]);

        $response->assertSessionHasErrors(['first_name']);

        $this->assertDatabaseHas('patients', [
            'id' => $patient->id,
            'first_name' => 'Original First',
        ]);
    }

    public function test_unauthenticated_user_cannot_update_patient(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'Original',
            'last_name' => 'Original',
        ]);

        $response = $this->put("/patients/{$patient->id}", [
            'first_name' => 'Updated',
            'last_name' => 'Updated',
        ]);

        $response->assertRedirect('/login');
    }
}
