<?php

use App\Models\User;

dataset('dashboards by role', [
    'user' => [fn () => User::factory()->create(), '/dashboard'],
    'admin' => [fn () => User::factory()->admin()->create(), '/admin/dashboard'],
]);

it('renders the login screen', function () {
    $this->get('/login')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Auth/Login'));
});

it('signs a user in and redirects them to the dashboard for their role', function (User $user, string $dashboard) {
    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect($dashboard);
})->with('dashboards by role');

it('is case insensitive about the email address', function () {
    $user = User::factory()->create(['email' => 'jane@example.com']);

    $this->post('/login', ['email' => 'JANE@Example.com', 'password' => 'password']);

    $this->assertAuthenticatedAs($user);
});

it('rejects a wrong password', function () {
    $user = User::factory()->create();

    $this->from('/login')
        ->post('/login', ['email' => $user->email, 'password' => 'wrong-password'])
        ->assertSessionHasErrors(['email' => 'These credentials do not match our records.']);

    $this->assertGuest();
});

it('rejects an unknown account', function () {
    $this->from('/login')
        ->post('/login', ['email' => 'nobody@example.com', 'password' => 'password'])
        ->assertSessionHasErrors(['email' => 'These credentials do not match our records.']);

    $this->assertGuest();
});

it('locks sign-in for a minute after five failed attempts', function () {
    $this->freezeTime();
    $user = User::factory()->create();

    foreach (range(1, 5) as $ignored) {
        $this->post('/login', ['email' => $user->email, 'password' => 'wrong-password']);
    }

    $this->from('/login')
        ->post('/login', ['email' => $user->email, 'password' => 'password'])
        ->assertSessionHasErrors(['email' => 'Too many login attempts. Please try again in 60 seconds.']);

    $this->assertGuest();
});

it('signs a user out', function () {
    $this->actingAs(User::factory()->create())
        ->post('/logout')
        ->assertRedirect('/');

    $this->assertGuest();
});

it('sends signed-in visitors from the login screen to the dashboard for their role', function (User $user, string $dashboard) {
    $this->actingAs($user)
        ->get('/login')
        ->assertRedirect($dashboard);
})->with('dashboards by role');
