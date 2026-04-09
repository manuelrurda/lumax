<?php

namespace Database\Factories;

use App\Enums\UserAcademicTitle;
use App\Enums\UserType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'account_number' => fake()->unique()->numerify('#########'),
            'type' => UserType::STUDENT->value,
            'academic_title' => UserAcademicTitle::BACHELOR->value,
            'rfc' => null,
            'curp' => fake()->unique()->randomElement([
                'GAVM540516HJCRRR02', 'CIMA561206HSPSNG00', 'VASA420527HSPZNG05',
                'GUEA520913HSPRSM10', 'VATA540713HSPZVN06', 'PAOA261130HSPLSN08',
                'TARS441029HSPPMN12', 'ROUM010315HDFDRNA1', 'ROUM010315HDFDRNA2']),
            'email' => fake()->unique()->userName() . '@comunidad.unam.mx',
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user is an academic.
     */
    public function academic(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => UserType::ACADEMIC->value,
            'academic_title' => fake()->randomElement([
                UserAcademicTitle::DOCTOR->value,
                UserAcademicTitle::MASTER->value,
                UserAcademicTitle::ENGINEER->value,
            ]),
            'rfc' => fake()->bothify('????######???'), // 13 characters
        ]);
    }

    /**
     * Indicate that the user is a staff worker.
     */
    public function staffWorker(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => UserType::STAFF_WORKER->value,
            'academic_title' => null,
            'rfc' => null,
        ]);
    }

    /**
     * Indicate that the user is a student.
     */
    public function student(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => UserType::STUDENT->value,
            'academic_title' => fake()->randomElement([
                UserAcademicTitle::BACHELOR->value,
                UserAcademicTitle::MASTER->value,
                UserAcademicTitle::PREPARATOR->value,
            ]),
            'rfc' => null,
        ]);
    }
}
