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

        Activity::truncate();

        // Update a non-tracked field
        $patient->update([
            'first_name' => 'Jane',
        ]);

        // As per our LogOptions only JSON fields are tracked
        $this->assertDatabaseCount('activity_log', 0);
    }
}
