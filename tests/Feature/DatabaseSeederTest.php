<?php

namespace Tests\Feature;

use App\Models\User;
use App\Rules\ValidRfc;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeded_users_have_structurally_valid_rfcs(): void
    {
        $this->seed(DatabaseSeeder::class);

        $rule = new ValidRfc;

        $seeded = User::whereIn('email', [
            'test@example.com',
            'house@example.com',
            'strange@example.com',
        ])->get();

        $this->assertCount(3, $seeded);

        foreach ($seeded as $user) {
            $fails = false;
            $rule->validate('rfc', $user->rfc, function () use (&$fails) {
                $fails = true;
            });

            $this->assertFalse($fails, "Seeded user {$user->email} has an RFC that fails ValidRfc.");
        }
    }

    public function test_seeded_rfcs_are_the_documented_fictional_values(): void
    {
        $this->seed(DatabaseSeeder::class);

        // Demo data must be obviously fictional — never a real person's RFC.
        $expected = [
            'test@example.com' => 'PRUE010101AB7',
            'house@example.com' => 'DEMO020202CD8',
            'strange@example.com' => 'FICT030303EFA',
        ];

        foreach ($expected as $email => $rfc) {
            $this->assertDatabaseHas('users', ['email' => $email, 'rfc' => $rfc]);
        }
    }
}
