<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatientCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_patient(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/patients', [
            'first_name' => 'Javier',
            'last_name' => 'Perez',
            'phone' => '1234567890',
            'email' => 'javier@ejemplo.com',
        ]);

        $response->assertRedirect('/patients');
        $response->assertSessionHas('message', 'Paciente guardado exitosamente.');
        
        $this->assertDatabaseHas('patients', [
            'first_name' => 'Javier',
            'last_name' => 'Perez',
            'phone' => '1234567890',
            'email' => 'javier@ejemplo.com',
        ]);
    }

    public function test_fields_are_validated(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/patients', [
            'first_name' => '',
            'last_name' => '',
            'phone' => 'abc', // invalid phone format
            'email' => 'not-an-email',
        ]);

        $response->assertSessionHasErrors(['first_name', 'last_name', 'phone', 'email']);
    }

    public function test_phone_and_email_are_nullable(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/patients', [
            'first_name' => 'Maria',
            'last_name' => 'Lopez',
        ]);

        $response->assertRedirect('/patients');
        
        $this->assertDatabaseHas('patients', [
            'first_name' => 'Maria',
            'last_name' => 'Lopez',
            'phone' => null,
            'email' => null,
        ]);
    }
    
    public function test_unauthenticated_user_cannot_create_patient(): void
    {
        $response = $this->post('/patients', [
            'first_name' => 'Javier',
            'last_name' => 'Perez',
        ]);

        $response->assertRedirect('/login');
    }
}
