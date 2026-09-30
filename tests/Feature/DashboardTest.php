<?php

use App\Models\User;

it('renders the dashboard for a signed-in user', function () {
    $this->actingAs(User::factory()->create())
        ->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Dashboard'));
});

it('redirects guests to the login screen', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});
