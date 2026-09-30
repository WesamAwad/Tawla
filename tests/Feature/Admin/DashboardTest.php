<?php

use App\Models\User;

it('renders the admin dashboard for an admin', function () {
    $this->actingAs(User::factory()->admin()->create())
        ->get('/admin/dashboard')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Admin/Dashboard'));
});

it('forbids regular users from the admin dashboard', function () {
    $this->actingAs(User::factory()->create())
        ->get('/admin/dashboard')
        ->assertForbidden();
});

it('redirects guests to the login screen', function () {
    $this->get('/admin/dashboard')->assertRedirect('/login');
});
