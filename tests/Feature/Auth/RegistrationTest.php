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
        'rfc' => 'XAXX010101000',
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
        'rfc' => 'XAXX010101000',
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
        'rfc' => 'XAXX010101000',
        'email' => $email,
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('register.store'), $userData);
    $response->assertInvalid('email');
});

test('registration fails on a malformed RFC with the right length', function () {
    // 13 characters, so it passes the old size:13 check, but the structure
    // and check digit are invalid, so ValidRfc must reject it.
    $response = $this->post(route('register.store'), [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'rfc' => 'ABCD123456EF7',
        'email' => 'bad.rfc@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertInvalid('rfc');
    $this->assertGuest();
    $this->assertDatabaseMissing('users', ['email' => 'bad.rfc@example.com']);
});

test('registration fails on an RFC with a wrong check digit', function () {
    $response = $this->post(route('register.store'), [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'rfc' => 'XAXX010101001',
        'email' => 'wrong.digit@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertInvalid('rfc');
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
