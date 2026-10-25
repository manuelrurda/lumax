<?php

namespace Tests\Feature;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Activitylog\Models\Activity;
use Tests\TestCase;

class PatientEstrabogramaFormTest extends TestCase
{
    use RefreshDatabase;

    private function makePatient(User $user): Patient
    {
        return Patient::create([
            'user_id' => $user->id,
            'first_name' => 'Gregory',
            'last_name' => 'House',
            'phone' => '1234567890',
            'email' => 'house@example.com',
        ]);
    }

    private function shapesPayload(): array
    {
        return [
            ['type' => 'line', 'points' => [10.5, 20.0, 90.0, 20.0], 'color' => '#1e293b'],
            ['type' => 'arrow', 'points' => [30.0, 80.0, 120.0, 40.0], 'color' => '#ef4444'],
            ['type' => 'text', 'x' => 55.0, 'y' => 66.0, 'text' => 'OD', 'color' => '#1e293b'],
        ];
    }

    public function test_estrabograma_shapes_persist_and_round_trip(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient($user);
        $shapes = $this->shapesPayload();

        $response = $this->actingAs($user)->put(route('patients.update', $patient->id), [
            'first_name' => 'Gregory',
            'last_name' => 'House',
            'estrabograma' => [
                'observaciones' => 'Sin desviación aparente.',
                'shapes' => $shapes,
            ],
        ]);

        $response->assertSessionHasNoErrors();

        // assertEquals, not assertSame: JSON storage normalizes 20.0 → 20.
        $this->assertEquals($shapes, $patient->fresh()->estrabograma['shapes']);
        $this->assertSame('Sin desviación aparente.', $patient->fresh()->estrabograma['observaciones']);

        // Round-trip: the record tab receives the same shapes back.
        $tab = $this->actingAs($user)->get(route('patients.estrabograma', $patient->id));
        $tab->assertStatus(200);
        $tab->assertInertia(fn (Assert $page) => $page
            ->component('patients/records/estrabograma')
            ->has('patient.estrabograma.shapes')
        );
        $this->assertEquals(
            $shapes,
            $tab->viewData('page')['props']['patient']['estrabograma']['shapes'],
        );
    }

    public function test_estrabograma_shapes_are_included_in_history_snapshot(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient($user);
        $shapes = $this->shapesPayload();

        $this->actingAs($user)->put(route('patients.update', $patient->id), [
            'first_name' => 'Gregory',
            'last_name' => 'House',
            'estrabograma' => ['shapes' => $shapes],
        ])->assertSessionHasNoErrors();

        $activity = Activity::where('subject_type', Patient::class)
            ->where('subject_id', $patient->id)
            ->where('event', 'updated')
            ->latest('id')
            ->first();

        $this->assertNotNull($activity, 'Expected an activity entry for the estrabograma update.');
        $this->assertEquals($shapes, $activity->properties->get('snapshot')['estrabograma']['shapes']);
    }

    public function test_legacy_estrabograma_payload_without_shapes_still_validates(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient($user);

        $response = $this->actingAs($user)->put(route('patients.update', $patient->id), [
            'first_name' => 'Gregory',
            'last_name' => 'House',
            'estrabograma' => [
                'campo_1' => '15',
                'campo_26' => '20',
                'observaciones' => 'Registro heredado.',
            ],
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertSame('15', $patient->fresh()->estrabograma['campo_1']);
        $this->assertArrayNotHasKey('shapes', $patient->fresh()->estrabograma);
    }
}
