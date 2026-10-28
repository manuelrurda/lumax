<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

function registrationPayload(array $overrides = []): array
{
    return array_merge([
        'first_name' => 'Jane',
        'last_name' => 'Doe',
        'rfc' => 'XAXX010101000',
        'email' => 'jane.doe@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ], $overrides);
}

test('an allowlisted email can register', function () {
    config(['registration.allowed_emails' => 'jane.doe@example.com']);

    $response = $this->post(route('register.store'), registrationPayload());

    $this->assertAuthenticated();
    $response->assertRedirect(route('patients', absolute: false));
    $this->assertDatabaseHas('users', ['email' => 'jane.doe@example.com']);
});

test('a non-allowlisted email is rejected and no account is created', function () {
    config(['registration.allowed_emails' => 'someone-else@example.com']);

    $response = $this->post(route('register.store'), registrationPayload());

    $response->assertInvalid(['email' => 'Este correo no está autorizado para registrarse. Contacta al administrador.']);
    $this->assertGuest();
    $this->assertDatabaseMissing('users', ['email' => 'jane.doe@example.com']);
    expect(User::count())->toBe(0);
});

test('an empty allowlist closes registration for everyone', function (mixed $emptyValue) {
    config(['registration.allowed_emails' => $emptyValue]);

    $response = $this->post(route('register.store'), registrationPayload());

    $response->assertInvalid('email');
    $this->assertGuest();
    expect(User::count())->toBe(0);
})->with([
    'null (unset env var)' => [null],
    'empty string' => [''],
    'only separators and whitespace' => [' , , '],
]);

test('the allowlist match tolerates case and whitespace in the configured value', function () {
    config(['registration.allowed_emails' => '  JANE.DOE@EXAMPLE.COM ,  other@example.com ']);

    $response = $this->post(route('register.store'), registrationPayload());

    $this->assertAuthenticated();
    $response->assertRedirect(route('patients', absolute: false));
    $this->assertDatabaseHas('users', ['email' => 'jane.doe@example.com']);
});
