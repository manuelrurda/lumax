<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard.index'))->assertRedirect(route('login'));
});

test('authenticated users can visit the inbox', function () {
    $user = User::factory()->student()->create();

    $response = $this->withoutVite()
        ->actingAs($user)
        ->get(route('dashboard.index'));
    
    $response->assertInertia(fn (Assert $page) => $page
        ->component('inbox/index')
        ->has('messages')
        ->has('filters')
    );
});