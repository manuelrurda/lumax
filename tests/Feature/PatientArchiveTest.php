<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PatientArchiveTest extends TestCase
{
    use RefreshDatabase;

    private function makePatient(User $user, array $attributes = []): Patient
    {
        return Patient::create(array_merge([
            'user_id' => $user->id,
            'first_name' => 'Archivable',
            'last_name' => 'Paciente',
            'email' => 'archivable@ejemplo.com',
            'phone' => '5512345678',
        ], $attributes));
    }

    private function makeAppointment(User $user, Patient $patient, $startsAt): Appointment
    {
        return Appointment::create([
            'user_id' => $user->id,
            'patient_id' => $patient->id,
            'title' => 'Consulta',
            'starts_at' => $startsAt,
            'ends_at' => $startsAt->copy()->addHour(),
        ]);
    }

    public function test_archive_hides_patient_from_index_search_and_appointment_picker(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient($user);
        $other = $this->makePatient($user, ['first_name' => 'Visible', 'email' => 'visible@ejemplo.com']);

        $this->actingAs($user)->delete("/patients/{$patient->id}")
            ->assertRedirect('/patients')
            ->assertSessionHas('message', 'Paciente archivado exitosamente.');

        $this->assertSoftDeleted('patients', ['id' => $patient->id]);

        // Index list
        $this->actingAs($user)->get('/patients')
            ->assertInertia(fn (Assert $page) => $page
                ->component('patients/index')
                ->where('patients.total', 1)
                ->where('patients.data.0.id', $other->id)
            );

        // Search API
        $this->actingAs($user)->getJson('/api/patients/search?q=Archivable')
            ->assertOk()
            ->assertJsonCount(0);
        $this->actingAs($user)->getJson('/api/patients/search')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $other->id);

        // Appointment form patient picker (Inertia appointments page)
        $this->actingAs($user)->get('/appointments')
            ->assertInertia(fn (Assert $page) => $page
                ->component('appointments/index')
                ->where('patients', fn ($patients) => collect($patients)->pluck('id')->all() === [$other->id])
            );
    }

    public function test_archive_wipes_future_appointments_but_keeps_past_ones(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient($user);

        $past = $this->makeAppointment($user, $patient, now()->subWeek());
        $futureA = $this->makeAppointment($user, $patient, now()->addDays(2));
        $futureB = $this->makeAppointment($user, $patient, now()->addDays(5));

        $this->actingAs($user)->delete("/patients/{$patient->id}")->assertRedirect('/patients');

        $this->assertDatabaseHas('appointments', ['id' => $past->id]);
        $this->assertDatabaseMissing('appointments', ['id' => $futureA->id]);
        $this->assertDatabaseMissing('appointments', ['id' => $futureB->id]);
        $this->assertSame(1, Appointment::where('patient_id', $patient->id)->count());
    }

    public function test_archived_patient_record_routes_return_404(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient($user);

        $this->actingAs($user)->delete("/patients/{$patient->id}");

        $this->actingAs($user)->get("/patients/{$patient->id}")->assertNotFound();
        $this->actingAs($user)->get("/patients/{$patient->id}/antecedentes")->assertNotFound();
        $this->actingAs($user)->get("/patients/{$patient->id}/refraccion")->assertNotFound();
    }

    public function test_restore_brings_patient_back_with_data_and_history_but_not_wiped_appointments(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient($user, [
            'refraccion' => ['od_esfera' => '-1.25'],
        ]);

        // Create clinical history via an update (the PUT flow).
        $this->actingAs($user)->put("/patients/{$patient->id}", [
            'refraccion' => ['od_esfera' => '-2.00'],
        ]);
        $activities = fn () => \Spatie\Activitylog\Models\Activity::where('subject_type', Patient::class)
            ->where('subject_id', $patient->id)
            ->orderBy('id')
            ->get();
        $originalActivityIds = $activities()->pluck('id')->all();
        $this->assertNotEmpty($originalActivityIds);

        $past = $this->makeAppointment($user, $patient, now()->subDays(3));
        $this->makeAppointment($user, $patient, now()->addDays(3));

        $this->actingAs($user)->delete("/patients/{$patient->id}");

        $response = $this->actingAs($user)->from('/patients/archived')
            ->post("/patients/{$patient->id}/restore");
        $response->assertRedirect('/patients/archived');
        $response->assertSessionHas('message', 'Paciente restaurado exitosamente.');

        $restored = Patient::find($patient->id);
        $this->assertNotNull($restored);
        $this->assertSame(['od_esfera' => '-2.00'], $restored->refraccion);

        // Every pre-archive history entry survives untouched. Archiving and
        // restoring append their own lifecycle entries ('deleted' and
        // 'restored', both with empty properties since only the clinical
        // columns are logged) — they don't alter the existing history.
        $after = $activities();
        foreach ($originalActivityIds as $id) {
            $this->assertTrue($after->contains('id', $id), "Activity #{$id} missing after restore");
        }
        $this->assertSame(['deleted', 'restored'], $after->whereNotIn('id', $originalActivityIds)->pluck('event')->values()->all());

        // Past appointment survived; the wiped future one did not come back.
        $this->assertDatabaseHas('appointments', ['id' => $past->id]);
        $this->assertSame(1, Appointment::where('patient_id', $patient->id)->count());

        // And the patient is listed again.
        $this->actingAs($user)->get('/patients')
            ->assertInertia(fn (Assert $page) => $page
                ->component('patients/index')
                ->where('patients.total', 1)
                ->where('patients.data.0.id', $patient->id)
            );
    }

    public function test_archived_listing_shows_only_archived_patients(): void
    {
        $user = User::factory()->create();
        $archived = $this->makePatient($user);
        $this->makePatient($user, ['first_name' => 'Activo', 'email' => 'activo@ejemplo.com']);

        $this->actingAs($user)->delete("/patients/{$archived->id}");

        $this->actingAs($user)->get('/patients/archived')
            ->assertInertia(fn (Assert $page) => $page
                ->component('patients/archived')
                ->where('patients.total', 1)
                ->where('patients.data.0.id', $archived->id)
                ->where('patients.data.0.deleted_at', fn ($deletedAt) => ! empty($deletedAt))
            );
    }

    public function test_user_cannot_archive_or_restore_another_users_patient(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $patient = $this->makePatient($owner);

        $this->actingAs($intruder)->delete("/patients/{$patient->id}")->assertForbidden();
        $this->assertDatabaseHas('patients', ['id' => $patient->id, 'deleted_at' => null]);

        $this->actingAs($owner)->delete("/patients/{$patient->id}");

        $this->actingAs($intruder)->post("/patients/{$patient->id}/restore")->assertNotFound();
        $this->assertSoftDeleted('patients', ['id' => $patient->id]);

        // Nor does the patient show up in the intruder's archived listing.
        $this->actingAs($intruder)->get('/patients/archived')
            ->assertInertia(fn (Assert $page) => $page
                ->component('patients/archived')
                ->where('patients.total', 0)
            );
    }

    public function test_calendar_feed_and_todays_panel_exclude_archived_patients_appointments(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient($user);

        // A past appointment stays in the DB after archiving...
        $this->makeAppointment($user, $patient, now()->subHours(2));
        // ...and one later today would normally appear in "Citas próximas".
        $laterToday = $this->makeAppointment($user, $patient, now()->addHours(2));

        $this->actingAs($user)->delete("/patients/{$patient->id}");

        // The wipe removed the future one; the past one remains stored.
        $this->assertSame(1, Appointment::where('patient_id', $patient->id)->count());
        $this->assertDatabaseMissing('appointments', ['id' => $laterToday->id]);

        // Calendar feed: no appointments for the archived patient at all.
        $this->actingAs($user)->getJson('/appointments?start='.now()->subMonth()->toDateString().'&end='.now()->addMonth()->toDateString())
            ->assertOk()
            ->assertJsonCount(0);

        // "Citas próximas" panel on the patients index: also empty.
        $this->actingAs($user)->get('/patients')
            ->assertInertia(fn (Assert $page) => $page
                ->component('patients/index')
                ->where('todaysAppointments', fn ($appointments) => count($appointments) === 0)
            );

        // Defense in depth: even if an archived patient somehow still has a
        // future appointment in the DB (e.g. archived before the wipe
        // existed), both surfaces must exclude it via whereHas('patient').
        $legacy = $this->makePatient($user, ['first_name' => 'Legado', 'email' => 'legado@ejemplo.com']);
        $this->makeAppointment($user, $legacy, now()->addHours(3));
        $legacy->delete(); // soft delete directly, bypassing the controller wipe

        $this->assertSame(1, Appointment::where('patient_id', $legacy->id)->count());

        $this->actingAs($user)->getJson('/appointments?start='.now()->subMonth()->toDateString().'&end='.now()->addMonth()->toDateString())
            ->assertOk()
            ->assertJsonCount(0);

        $this->actingAs($user)->get('/patients')
            ->assertInertia(fn (Assert $page) => $page
                ->component('patients/index')
                ->where('todaysAppointments', fn ($appointments) => count($appointments) === 0)
            );
    }

    public function test_cannot_create_appointment_for_archived_patient(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient($user);

        $this->actingAs($user)->delete("/patients/{$patient->id}");

        $this->actingAs($user)->from('/appointments')->post('/appointments', [
            'patient_id' => $patient->id,
            'title' => 'Consulta',
            'starts_at' => now()->addWeek()->toDateTimeString(),
            'ends_at' => now()->addWeek()->addHour()->toDateTimeString(),
        ])->assertSessionHasErrors('patient_id');

        $this->assertSame(0, Appointment::count());
    }

    public function test_index_payload_includes_future_appointments_count(): void
    {
        $user = User::factory()->create();
        $patient = $this->makePatient($user);
        $this->makeAppointment($user, $patient, now()->subDay());
        $this->makeAppointment($user, $patient, now()->addDay());
        $this->makeAppointment($user, $patient, now()->addDays(4));

        $this->actingAs($user)->get('/patients')
            ->assertInertia(fn (Assert $page) => $page
                ->component('patients/index')
                ->where('patients.data.0.future_appointments_count', 2)
            );
    }
}
