<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\User;
use App\Notifications\WebVerifyEmail;
use App\Services\Auth\ProvisioningState;
use App\Services\Auth\WebAccountProvisioner;
use App\Services\Auth\WebRegistrationService;
use App\Services\UserStateManager;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;

final class WebAuthTest extends TestCase
{
    use RefreshDatabase;

    /** @return void */
    protected function setUp(): void
    {
        parent::setUp();
        config(['services.remnawave.api_url' => 'https://panel.test', 'services.remnawave.token' => 'api-token']);
        Http::preventStrayRequests();
        Notification::fake();
    }

    /** @return void */
    public function test_guest_pages_render_and_account_requires_the_web_guard(): void
    {
        foreach (['/login' => 'Auth/Login', '/register' => 'Auth/Register', '/forgot-password' => 'Auth/ForgotPassword', '/reset-password/test-token' => 'Auth/ResetPassword'] as $url => $component) {
            $this->get($url)->assertOk()->assertInertia(fn(Assert $page) => $page->component($component));
        }
        $this->get('/account')->assertRedirect('/login');
        $this->post('/account/provisioning')->assertRedirect('/login');
        $this->delete('/logout')->assertRedirect('/login');
    }

    /** @return void */
    public function test_login_normalizes_email_and_preserves_intended_destination(): void
    {
        $user = User::factory()->web()->verified()->create(['email' => 'dude@example.test']);
        $this->get('/account?source=landing')->assertRedirect('/login');
        $this->post('/login', ['email' => ' DUDE@EXAMPLE.TEST ', 'password' => 'password123'])->assertRedirect('/account?source=landing');
        $this->assertAuthenticatedAs($user, 'web');
        self::assertSame('moonshine', config('auth.defaults.guard'));
    }

    /** @return void */
    public function test_invalid_login_and_validation_never_authenticate(): void
    {
        User::factory()->web()->verified()->create(['email' => 'dude@example.test']);
        $this->post('/login', ['email' => 'dude@example.test', 'password' => 'incorrect'])->assertSessionHasErrors('email');
        $this->post('/login', ['email' => 'invalid', 'password' => ''])->assertSessionHasErrors(['email', 'password']);
        $this->assertGuest('web');
    }

    /** @return void */
    public function test_login_throttle_normalizes_identity_and_reports_a_form_error(): void
    {
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->post('/login', ['email' => ' DUDE@EXAMPLE.TEST ', 'password' => 'wrong'])->assertSessionHasErrors('email');
        }
        $this->post('/login', ['email' => 'dude@example.test', 'password' => 'wrong'])->assertSessionHasErrors('form');
        $this->assertGuest('web');
    }

    /** @return void */
    public function test_registration_validates_confirmed_password_and_unique_normalized_identity(): void
    {
        $this->post('/register', ['email' => 'dude@example.test', 'password' => 'password123', 'password_confirmation' => 'different'])->assertSessionHasErrors('password');
        $this->assertDatabaseCount('users', 0);
        User::factory()->web()->verified()->create(['email' => 'dude@example.test']);
        $this->post('/register', $this->registrationData())->assertSessionHasErrors('email');
        $this->post('/register', ['email' => 'new@example.test', 'password' => str_repeat('я', 40), 'password_confirmation' => str_repeat('я', 40)])->assertSessionHasErrors('password');
        Http::assertNothingSent();
    }

    /** @return void */
    public function test_registration_authenticates_immediately_and_waits_for_email_before_creating_a_trial(): void
    {
        $telegram = User::factory()->create();
        $this->post('/register', $this->registrationData())
            ->assertRedirect('/email/verify')->assertSessionHasNoErrors()->assertSessionHas('status', 'verification-link-sent');
        $user = User::query()->where('email', 'dude@example.test')->sole();
        $this->assertAuthenticatedAs($user, 'web');
        self::assertNull($user->chat_id);
        self::assertNull($user->username);
        self::assertNull($user->email_verified_at);
        self::assertSame(UserTags::Inactive, $user->tags);
        self::assertNull($user->remnawave_user_id);
        self::assertSame(ProvisioningState::Pending, $user->provisioning_state);
        self::assertTrue(Hash::check('password123', $user->password));
        self::assertNotSame($telegram->id, $user->id);
        $this->assertDatabaseCount('users', 2);
        Notification::assertSentTo($user, WebVerifyEmail::class);
        Http::assertNothingSent();
        $this->get('/account')->assertRedirect('/email/verify');
        $this->get('/email/verify')->assertOk()->assertInertia(fn(Assert $page) => $page->component('Auth/VerifyEmail')->where('email', $user->email)->missing('password')->missing('provisioning_key')->missing('remnawave_user_id'));
        self::assertArrayNotHasKey('password', $user->toArray());
        self::assertArrayNotHasKey('provisioning_key', $user->toArray());
    }

    /** @return void */
    public function test_remote_failure_keeps_authenticated_account_and_retry_reconciles_the_same_key(): void
    {
        $available = false;
        Http::fake(function (Request $request) use (&$available) {
            return $available
                ? Http::response(['response' => $this->remoteUser(basename($request->url()), 'dude@example.test')])
                : Http::response(['message' => 'unavailable'], 503);
        });
        $this->post('/register', $this->registrationData())->assertRedirect('/email/verify');
        $user = User::query()->where('email', 'dude@example.test')->sole();
        $this->get(URL::temporarySignedRoute('verification.verify', now()->addHour(), ['id' => $user->id, 'hash' => sha1($user->email)]))->assertRedirect('/account');
        $user->refresh();
        $this->assertAuthenticatedAs($user, 'web');
        self::assertSame(UserTags::Inactive, $user->tags);
        self::assertSame(ProvisioningState::ServiceError, $user->provisioning_state);
        self::assertNull($user->remnawave_user_id);
        $key = $user->provisioning_key;
        $available = true;
        $this->post('/account/provisioning')->assertRedirect('/account');
        self::assertSame($key, $user->refresh()->provisioning_key);
        self::assertSame(42, $user->remnawave_user_id);
        self::assertSame(ProvisioningState::Ready, $user->provisioning_state);
        Http::assertSent(fn(Request $request): bool => $request->method() === 'GET' && str_ends_with($request->url(), $key));
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->post('/account/provisioning')->assertRedirect('/account');
        }
        $this->post('/account/provisioning')->assertSessionHasErrors('form');
    }

    /** @return void */
    public function test_ambiguous_create_response_recovers_without_creating_another_remote_user(): void
    {
        $user = User::factory()->web()->verified()->create();
        $creates = 0;
        $created = false;
        Http::fake(function (Request $request) use ($user, &$created, &$creates) {
            if ($request->method() === 'POST') {
                $created = true;
                $creates++;
                return Http::failedConnection();
            }
            return $created ? Http::response(['response' => $this->remoteUser($user->provisioning_key, $user->email)]) : Http::response(['message' => 'missing'], 404);
        });
        $provisioner = app(WebAccountProvisioner::class);
        self::assertFalse($provisioner->provision($user));
        self::assertTrue($provisioner->provision($user));
        self::assertTrue($provisioner->provision($user));
        self::assertSame(1, $creates);
        self::assertSame(42, $user->refresh()->remnawave_user_id);
    }

    /** @return void */
    public function test_provisioning_conflict_does_not_claim_another_identity(): void
    {
        $user = User::factory()->web()->verified()->create();
        Http::fake(['*' => Http::response(['response' => $this->remoteUser($user->provisioning_key, 'other@example.test')])]);
        self::assertFalse(app(WebAccountProvisioner::class)->provision($user));
        self::assertNull($user->refresh()->remnawave_user_id);
        self::assertSame(UserTags::Inactive, $user->tags);
    }

    /** @return void */
    public function test_guest_routes_redirect_web_sessions_and_logout_invalidates_the_session(): void
    {
        $user = User::factory()->web()->verified()->create();
        $this->actingAs($user, 'web');
        foreach (['/login', '/register', '/forgot-password', '/reset-password/token'] as $url) {
            $this->get($url)->assertRedirect('/account');
        }
        $this->delete('/logout')->assertRedirect('/');
        $this->assertGuest('web');
    }

    /** @return void */
    public function test_moonshine_session_alone_does_not_grant_web_access(): void
    {
        Auth::guard('moonshine')->setUser(User::factory()->create());
        $this->get('/account')->assertRedirect('/login');
        $this->get('/login')->assertOk();
    }

    /** @return void */
    public function test_telegram_accounts_cannot_use_the_web_provisioning_mutation(): void
    {
        $this->actingAs(User::factory()->create(), 'web')->post('/account/provisioning')->assertRedirect('/email/verify');
        $this->get('/email/verify')->assertForbidden();
        Http::assertNothingSent();
    }

    /** @return void */
    public function test_remote_reads_for_web_accounts_use_numeric_id(): void
    {
        $user = User::factory()->web()->verified()->create(['remnawave_user_id' => 42]);
        Http::fake(['panel.test/api/users/42' => Http::response(['response' => $this->remoteUser('renamed', $user->email)])]);
        self::assertSame(42, app(UserStateManager::class)->getRemoteUser($user)->id);
        Http::assertSent(fn(Request $request): bool => $request->url() === 'https://panel.test/api/users/42');
    }

    /** @return void */
    public function test_password_change_invalidates_an_existing_web_session(): void
    {
        $user = User::factory()->web()->verified()->create();
        Auth::guard('web')->login($user);
        $this->get('/account')->assertOk();
        User::query()->whereKey($user->id)->update(['password' => Hash::make('another-password123')]);
        $this->app['auth']->forgetGuards();
        $this->get('/account')->assertRedirect('/login');
        $this->assertGuest('web');
    }

    /** @return void */
    public function test_registration_throttle_does_not_create_accounts_from_repeated_invalid_forms(): void
    {
        for ($attempt = 0; $attempt < 3; $attempt++) {
            $this->post('/register', ['email' => 'dude@example.test', 'password' => 'short'])->assertSessionHasErrors('password');
        }
        $this->post('/register', $this->registrationData())->assertSessionHasErrors('form');
        $this->assertDatabaseCount('users', 0);
        Http::assertNothingSent();
    }

    /** @return void */
    public function test_database_duplicate_email_after_validation_returns_a_validation_error(): void
    {
        User::factory()->web()->verified()->create(['email' => 'dude@example.test']);
        $this->expectException(ValidationException::class);
        app(WebRegistrationService::class)->create('dude@example.test', 'password123');
    }

    /** @return void */
    public function test_database_rejects_a_user_without_any_identity_channel(): void
    {
        $this->expectException(QueryException::class);
        User::factory()->create(['username' => null, 'chat_id' => null]);
    }

    /** @return array<string, string> */
    private function registrationData(): array
    {
        return ['email' => ' DUDE@EXAMPLE.TEST ', 'password' => 'password123', 'password_confirmation' => 'password123'];
    }

    /**
     * @param string $username
     * @param string $email
     * @return array<string, mixed>
     */
    private function remoteUser(string $username, string $email): array
    {
        return [
            'id' => 42, 'shortUuid' => 'short', 'username' => $username, 'email' => $email,
            'status' => 'ACTIVE', 'trafficLimitBytes' => 32212254720, 'trafficLimitStrategy' => 'NO_RESET',
            'expireAt' => now()->addDays(3)->utc()->toISOString(), 'telegramId' => null, 'tag' => 'TRIAL',
            'trojanPassword' => 'remote-secret', 'vlessUuid' => '00000000-0000-4000-8000-000000000002', 'ssPassword' => 'remote-secret',
            'createdAt' => now()->toISOString(), 'updatedAt' => now()->toISOString(), 'subscriptionUrl' => 'https://example.test/sub',
            'activeInternalSquads' => [], 'lastTriggeredThreshold' => 0,
            'userTraffic' => ['usedTrafficBytes' => 0, 'lifetimeUsedTrafficBytes' => 0],
        ];
    }
}
