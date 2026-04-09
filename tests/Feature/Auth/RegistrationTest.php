<?php

use App\Enums\UserAcademicTitle;
use App\Enums\UserType;
use App\Models\User;
use Illuminate\Support\Facades\Config;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    Config::set('email.allowed_domains', [
        '@comunidad.unam.mx',
        '@unam.mx',
    ]);
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));
    $response->assertStatus(200);
});

test('new users can register successfully with different user types and configurations', function (
    string $type,
    ?string $academicTitle,
    ?string $rfc,
    ?string $expectedAcademicTitle,
    ?string $expectedRfc
) {
    $baseData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'account_number' => '123456789',
        'type' => $type,
        'curp' => 'TARS441029HSPPMN12',
        'email' => 'test' . uniqid() . '@comunidad.unam.mx',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    if ($academicTitle !== null) {
        $baseData['academic_title'] = $academicTitle;
    }

    if ($rfc !== null) {
        $baseData['rfc'] = $rfc;
    }

    $response = $this->post(route('register.store'), $baseData);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard.index', absolute: false));
    $this->assertDatabaseHas('users', [
        'account_number' => $baseData['account_number'],
        'curp' => $baseData['curp'],
        'email' => $baseData['email'],
        'type' => $type,
        'academic_title' => $expectedAcademicTitle,
        'rfc' => $expectedRfc,
    ]);
})->with([
    'student with bachelor title' => [
        UserType::STUDENT->value,
        UserAcademicTitle::BACHELOR->value,
        null,
        UserAcademicTitle::BACHELOR->value,
        null,
    ],
    'student with master title' => [
        UserType::STUDENT->value,
        UserAcademicTitle::MASTER->value,
        null,
        UserAcademicTitle::MASTER->value,
        null,
    ],
    'academic with master title and RFC' => [
        UserType::ACADEMIC->value,
        UserAcademicTitle::MASTER->value,
        'ROUM010315B27',
        UserAcademicTitle::MASTER->value,
        'ROUM010315B27',
    ],
    'academic with doctor title and RFC' => [
        UserType::ACADEMIC->value,
        UserAcademicTitle::DOCTOR->value,
        'ROUM010315B27',
        UserAcademicTitle::DOCTOR->value,
        'ROUM010315B27',
    ],
    'academic with engineer title and RFC' => [
        UserType::ACADEMIC->value,
        UserAcademicTitle::ENGINEER->value,
        'ROUM010315B27',
        UserAcademicTitle::ENGINEER->value,
        'ROUM010315B27',
    ],
    'staff worker without academic title' => [
        UserType::STAFF_WORKER->value,
        null,
        null,
        null,
        null,
    ],
    'academic without RFC' => [
        UserType::ACADEMIC->value,
        UserAcademicTitle::MASTER->value,
        null,
        UserAcademicTitle::MASTER->value,
        null,
    ],
]);

test('registration fails on missing required fields', function (string $fieldToRemove) {
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'account_number' => '123456789',
        'type' => UserType::STUDENT->value,
        'curp' => 'ROUM010315HDFDRNA1',
        'email' => 'john.doe@comunidad.unam.mx',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    unset($userData[$fieldToRemove]);
    $response = $this->post(route('register.store'), $userData);
    $response->assertInvalid($fieldToRemove);
})->with([
    'first_name',
    'last_name',
    'account_number',
    'type',
    'curp',
    'email',
    'password',
]);

test('registration fails on invalid CURP', function () {
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'account_number' => '123456789',
        'type' => UserType::STUDENT->value,
        'curp' => 'INVALIDCURP1728',
        'email' => 'john.doe@comunidad.unam.mx',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('register.store'), $userData);
    $response->assertInvalid('curp');
});

test('registration fails on invalid account number', function () {
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'account_number' => '1237ABCD67',
        'type' => UserType::STUDENT->value,
        'curp' => 'ROUM010315HDFDRNA1',
        'email' => 'john.doe@comunidad.unam.mx',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('register.store'), $userData);
    $response->assertInvalid('account_number');
});

test('registration fails on duplicate email', function () {
    $email = 'john.doe@comunidad.unam.mx';
    User::factory()->create(['email' => $email]);
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'account_number' => '1234567890',
        'type' => UserType::STUDENT->value,
        'curp' => 'ROUM010315HDFDRNA1',
        'email' => $email,
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('register.store'), $userData);
    $response->assertInvalid('email');
});

test('registration fails on invalid user type', function (string $invalidType) {
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'account_number' => '123456789',
        'type' => $invalidType,
        'curp' => 'ROUM010315HDFDRNA1',
        'email' => 'john.doe@comunidad.unam.mx',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('register.store'), $userData);
    $response->assertInvalid('type');
})->with([
    'invalid_type',
    'unknown',
    'admin',
    'teacher',
    '',
]);

test('registration fails on invalid academic title', function (string $invalidTitle) {
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'account_number' => '123456789',
        'type' => UserType::ACADEMIC->value,
        'academic_title' => $invalidTitle,
        'curp' => 'ROUM010315HDFDRNA1',
        'email' => 'john.doe@comunidad.unam.mx',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('register.store'), $userData);
    $response->assertInvalid('academic_title');
})->with([
    'invalid_title',
    'phd',
    'professor',
    'licenciado'
]);

test('registration fails on invalid RFC length', function (string $invalidRfc) {
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'account_number' => '123456789',
        'type' => UserType::ACADEMIC->value,
        'academic_title' => UserAcademicTitle::MASTER->value,
        'rfc' => $invalidRfc,
        'curp' => 'ROUM010315HDFDRNA1',
        'email' => 'john.doe@comunidad.unam.mx',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('register.store'), $userData);
    $response->assertInvalid('rfc');
})->with([
    'SHORT',
    'VERYLONGRFC12345',
    '123456789012',
    '12345678901234',
]);

test('registration succeeds with valid RFC of 13 characters', function (string $validRfc) {
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'account_number' => '123456789',
        'type' => UserType::ACADEMIC->value,
        'academic_title' => UserAcademicTitle::DOCTOR->value,
        'rfc' => $validRfc,
        'curp' => 'TARS441029HSPPMN12',
        'email' => 'test' . uniqid() . '@comunidad.unam.mx',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('register.store'), $userData);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard.index', absolute: false));
    $this->assertDatabaseHas('users', [
        'rfc' => $validRfc,
    ]);
})->with([
    'ROUM010315B27',
    'ABCD123456EF7',
    'XYZ987654321A',
]);

test('registration succeeds without optional fields for different user types', function (string $userType) {
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'account_number' => '123456789',
        'type' => $userType,
        'curp' => 'TARS441029HSPPMN12',
        'email' => 'test' . uniqid() . '@comunidad.unam.mx',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];
    
    $response = $this->post(route('register.store'), $userData);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard.index', absolute: false));
    $this->assertDatabaseHas('users', [
        'email' => $userData['email'],
        'type' => $userType,
        'academic_title' => null,
        'rfc' => null,
    ]);
})->with([
    UserType::STUDENT->value,
    UserType::STAFF_WORKER->value,
    UserType::ACADEMIC->value,
]);

test('registration fails on duplicate unique fields', function (string $field) {
    $existingUser = User::factory()->create();
    
    $duplicateValue = match($field) {
        'account_number' => $existingUser->account_number,
        'curp' => $existingUser->curp,
        'email' => $existingUser->email,
        default => throw new \InvalidArgumentException("Unknown field: {$field}"),
    };
    
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'account_number' => $field === 'account_number' ? $duplicateValue : uniqid('', true),
        'type' => UserType::STUDENT->value,
        'curp' => $field === 'curp' ? $duplicateValue : 'ROUM010315HDFDRNA' . rand(1, 9),
        'email' => $field === 'email' ? $duplicateValue : 'test' . uniqid() . '@comunidad.unam.mx',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('register.store'), $userData);
    $response->assertInvalid($field);
})->with([
    'account_number',
    'curp',
    'email',
]);

test('registration fails on email with non-allowed domain', function (string $invalidEmail) {
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'account_number' => '123456789',
        'type' => UserType::STUDENT->value,
        'curp' => 'ROUM010315HDFDRNA1',
        'email' => $invalidEmail,
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('register.store'), $userData);
    $response->assertInvalid('email');
})->with([
    'john.doe@example.com',
    'test@gmail.com',
    'user@yahoo.com',
    'admin@hotmail.com',
    'user@invalid-domain.com',
]);

test('registration succeeds with allowed email domain @comunidad.unam.mx', function () {
    $uniqueId = uniqid();
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'account_number' => '1234567890',
        'type' => UserType::STUDENT->value,
        'curp' => 'GUEA520913HSPRSM10',
        'email' => 'test' . $uniqueId . '@comunidad.unam.mx',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('register.store'), $userData);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('users', [
        'email' => $userData['email'],
    ]);
    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard.index', absolute: false));
});

test('registration succeeds with allowed email domain @unam.mx', function () {
    $uniqueId = uniqid();
    $userData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'account_number' => '1234567890',
        'type' => UserType::STUDENT->value,
        'curp' => 'VATA540713HSPZVN06',
        'email' => 'test' . $uniqueId . '@unam.mx',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('register.store'), $userData);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('users', [
        'email' => $userData['email'],
    ]);
    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard.index', absolute: false));
});