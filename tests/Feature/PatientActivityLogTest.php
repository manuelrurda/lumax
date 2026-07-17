<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Activitylog\Models\Activity;
use Tests\TestCase;

class PatientActivityLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_logs_activity_when_tracked_medical_fields_are_updated(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'refraccion' => ['test' => 'old_value'],
        ]);

        // Clear any activities generated during creation if any
        Activity::truncate();

        // Update a tracked field
        $patient->update([
            'refraccion' => ['test' => 'new_value'],
        ]);

        $this->assertDatabaseCount('activity_log', 1);

        $activity = Activity::first();
        $this->assertEquals('App\Models\Patient', $activity->subject_type);
        $this->assertEquals($patient->id, $activity->subject_id);

        $changes = $activity->attribute_changes;
        $this->assertEquals(['test' => 'new_value'], $changes['attributes']['refraccion']);
        $this->assertEquals(['test' => 'old_value'], $changes['old']['refraccion']);
    }

    public function test_it_does_not_log_activity_if_no_tracked_fields_are_changed(): void
    {
        $user = User::factory()->create();
        $patient = Patient::create([
            'user_id' => $user->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'refraccion' => ['test' => 'data'],
        ]);

        // Spatie logs the 'created' event if logOnlyDirty is off and we don't have logOnlyDirty. 
        // We clear everything out first.
        Activity::truncate();

        // Update a non-tracked field
        $patient->update([
            'first_name' => 'Jane',
        ]);

        // With logOnlyDirty removed, Spatie logs every time an updated event happens if we don't strictly filter it.
        // Wait, dontLogEmptyChanges() should prevent it if the tracked fields are identical.
        // Let's assert it correctly.
        $this->assertDatabaseCount('activity_log', 0);
    }
}
