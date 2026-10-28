<?php

use App\Models\User;
use App\Support\EmailAllowlist;

test('it normalizes a comma-separated string', function () {
    $allowlist = new EmailAllowlist(' First@Example.com, second@example.com,, FIRST@example.com , ');

    expect($allowlist->emails())->toBe([
        'first@example.com',
        'second@example.com',
    ]);
});

test('it normalizes array input and discards invalid entries', function () {
    $allowlist = new EmailAllowlist([
        ' Admin@Example.com ',
        '',
        'admin@example.com',
        null,
        42,
        'Other@Example.com, ADMIN@example.com',
    ]);

    expect($allowlist->emails())->toBe([
        'admin@example.com',
        'other@example.com',
    ]);
});

test('it allows listed email strings case-insensitively', function () {
    $allowlist = new EmailAllowlist('doctor@example.com');

    expect($allowlist->allows(' DOCTOR@EXAMPLE.COM '))->toBeTrue()
        ->and($allowlist->allows('someone-else@example.com'))->toBeFalse();
});

test('it allows a user whose email is listed', function () {
    $allowlist = new EmailAllowlist(['doctor@example.com']);
    $user = new User(['email' => 'Doctor@Example.com']);

    expect($allowlist->allows($user))->toBeTrue();
});

test('it safely denies null and unsupported subjects', function () {
    $allowlist = new EmailAllowlist('doctor@example.com');

    expect($allowlist->allows(null))->toBeFalse()
        ->and($allowlist->allows(''))->toBeFalse()
        ->and($allowlist->allows(42))->toBeFalse()
        ->and($allowlist->allows(new stdClass))->toBeFalse();
});

test('an empty allowlist denies everyone', function () {
    expect((new EmailAllowlist)->allows('doctor@example.com'))->toBeFalse()
        ->and((new EmailAllowlist(null))->emails())->toBe([])
        ->and((new EmailAllowlist(''))->emails())->toBe([])
        ->and((new EmailAllowlist([]))->emails())->toBe([]);
});
