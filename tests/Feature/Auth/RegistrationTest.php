<?php

use App\Models\User;
use Illuminate\Support\Facades\Log;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));
    $response->assertStatus(200);
});

test('new users can register successfully', function () {
    $response = $this->post(route('register.store'), [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'rfc' => 'ABCD123456EF7',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('patients', absolute: false));
    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
    ]);
});

test('registration fails on missing required fields', function (string $fieldToRemove) {
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'rfc' => 'ABCD123456EF7',
        'email' => 'john.doe@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    unset($userData[$fieldToRemove]);
    $response = $this->post(route('register.store'), $userData);
    $response->assertInvalid($fieldToRemove);
})->with([
    'first_name',
    'last_name',
    'rfc',
    'email',
    'password',
]);

test('registration fails on duplicate email', function () {
    $email = 'john.doe@example.com';
    User::factory()->create(['email' => $email]);
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'rfc' => 'ABCD123456EF7',
        'email' => $email,
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('register.store'), $userData);
    $response->assertInvalid('email');
});
test('registration does not write the plaintext password to the log', function () {
    $logged = [];

    Log::listen(function ($event) use (&$logged) {
        $logged[] = (string) $event->message;

        foreach ((array) $event->context as $key => $value) {
            $logged[] = $key.'='.json_encode($value);
        }
    });

    $secret = 'super-secret-password-123';

    $response = $this->post(route('register.store'), [
        'first_name' => 'Log',
        'last_name' => 'Safety',
        'rfc' => 'ABCD123456EF7',
        'email' => 'log.safety@example.com',
        'password' => $secret,
        'password_confirmation' => $secret,
    ]);

    $response->assertRedirect(route('patients', absolute: false));

    foreach ($logged as $entry) {
        expect($entry)->not->toContain($secret);
    }
});
