<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'first_name' => 'Test',
                'last_name' => 'User',
                'rfc' => 'PRUE010101AB7',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        Patient::factory()->count(20)->create(['user_id' => $user->id]);

        $drHouse = User::firstOrCreate(
            ['email' => 'house@example.com'],
            [
                'first_name' => 'Gregory',
                'last_name' => 'House',
                'rfc' => 'DEMO020202CD8',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        Patient::factory()->count(5)->create(['user_id' => $drHouse->id]);

        $drStrange = User::firstOrCreate(
            ['email' => 'strange@example.com'],
            [
                'first_name' => 'Stephen',
                'last_name' => 'Strange',
                'rfc' => 'FICT030303EFA',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        Patient::factory()->count(15)->create(['user_id' => $drStrange->id]);
    }
}
