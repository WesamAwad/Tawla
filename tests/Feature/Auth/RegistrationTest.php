<?php

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;

function validRegistrationPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'password' => 'Secret!Passw0rd',
        'password_confirmation' => 'Secret!Passw0rd',
    ], $overrides);
}

it('renders the registration screen', function () {
    $this->get('/register')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Auth/Register'));
});

it('registers a new user, signs them in and redirects them to the dashboard', function () {
    Event::fake([Registered::class]);

    $response = $this->post('/register', validRegistrationPayload());

    $response->assertRedirect('/dashboard');
    $this->assertDatabaseHas('users', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'role' => 'user',
    ]);
    $user = User::firstWhere('email', 'jane@example.com');
    $this->assertAuthenticatedAs($user);
    expect(Hash::check('Secret!Passw0rd', $user->password))->toBeTrue();
    Event::assertDispatched(Registered::class);
});

it('ignores a role submitted with the registration form', function () {
    $this->post('/register', validRegistrationPayload(['role' => 'admin']));

    $this->assertDatabaseHas('users', ['email' => 'jane@example.com', 'role' => 'user']);
});

it('requires a name, an email address and a password', function () {
    $this->from('/register')
        ->post('/register', [])
        ->assertSessionHasErrors([
            'name' => 'The name field is required.',
            'email' => 'The email field is required.',
            'password' => 'The password field is required.',
        ]);

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
});

it('rejects invalid registration details', function (array $overrides, string $field, string $message) {
    $this->from('/register')
        ->post('/register', validRegistrationPayload($overrides))
        ->assertSessionHasErrors([$field => $message]);

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
})->with([
    'a name longer than 255 characters' => [
        ['name' => str_repeat('a', 256)],
        'name',
        'The name field must not be greater than 255 characters.',
    ],
    'a malformed email address' => [
        ['email' => 'not-an-email'],
        'email',
        'The email field must be a valid email address.',
    ],
    'an email address with capital letters' => [
        ['email' => 'Jane@Example.com'],
        'email',
        'The email field must be lowercase.',
    ],
    'a password shorter than eight characters' => [
        ['password' => 'short', 'password_confirmation' => 'short'],
        'password',
        'The password field must be at least 8 characters.',
    ],
    'a password confirmation that does not match' => [
        ['password_confirmation' => 'something-else'],
        'password',
        'The password field confirmation does not match.',
    ],
]);

it('rejects an email address that is already registered', function () {
    User::factory()->create(['email' => 'jane@example.com']);

    $this->from('/register')
        ->post('/register', validRegistrationPayload())
        ->assertSessionHasErrors(['email' => 'The email has already been taken.']);

    $this->assertGuest();
    $this->assertDatabaseCount('users', 1);
});

it('sends signed-in users from the registration screen to their dashboard', function () {
    $this->actingAs(User::factory()->create())
        ->get('/register')
        ->assertRedirect('/dashboard');
});
