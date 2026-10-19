<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\User;
use App\Notifications\WebVerifyEmail;
use App\Services\Auth\ProvisioningState;
use App\Services\Auth\WebAccountProvisioner;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;
use RuntimeException;
use Tests\TestCase;

final class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Готовит изолированное окружение перед каждым тестом.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        config(['services.remnawave.api_url' => 'https://panel.test', 'services.remnawave.token' => 'api-token']);
        Http::preventStrayRequests();
        Notification::fake();
    }

    /**
     * Verify that unverified user cannot access account provisioning or payments.
     *
     * @return void
     */
    public function test_unverified_user_cannot_access_account_provisioning_or_payments(): void
    {
        $user = User::factory()->web()->create();
        $this->actingAs($user, 'web')->get('/account')->assertRedirect('/email/verify');
        $this->post('/account/provisioning')->assertRedirect('/email/verify');
        $this->postJson('/payments', ['product_id' => 1])->assertForbidden();
        self::assertFalse(app(WebAccountProvisioner::class)->provision($user));
        self::assertSame(ProvisioningState::Pending, $user->refresh()->provisioning_state);
        self::assertNull($user->remnawave_user_id);
        Http::assertNothingSent();
        $this->assertDatabaseCount('payments', 0);
        $this->delete('/logout')->assertRedirect('/');
        $this->assertGuest('web');
    }

    /**
     * Verify that login waits for verification and preserves the original destination.
     *
     * @return void
     */
    public function test_login_waits_for_verification_and_preserves_the_original_destination(): void
    {
        $user = User::factory()->web()->create();
        $this->get('/account?source=landing')->assertRedirect('/login');
        $this->post('/login', ['email' => $user->email, 'password' => 'password123'])->assertRedirect('/email/verify');
        $this->assertAuthenticatedAs($user, 'web');
        $this
            ->get('/email/verify')
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page->component('Auth/VerifyEmail')->where('email', $user->email));
        $this->fakeRemote($user);
        $this->get($this->verificationUrl($user))->assertRedirect('/account?source=landing');
        $this->get('/account')->assertOk();
    }

    /**
     * Verify that valid link verifies email and creates exactly one trial from confirmation time.
     *
     * @return void
     */
    public function test_valid_link_verifies_email_and_creates_exactly_one_trial_from_confirmation_time(): void
    {
        Event::fake([Verified::class]);
        $user = User::factory()->web()->create(['created_at' => now()->subDays(4)]);
        $this->freezeTime();
        $expires = now()->startOfSecond()->addDays(3)->utc()->toISOString();
        $this->fakeRemote($user);
        $link = $this->verificationUrl($user);
        $this->actingAs($user, 'web')->get($link)->assertRedirect('/account');
        self::assertTrue($user->refresh()->hasVerifiedEmail());
        self::assertSame(42, $user->remnawave_user_id);
        self::assertSame(ProvisioningState::Ready, $user->provisioning_state);
        self::assertSame(UserTags::Trial, $user->tags);
        $verifiedAt = $user->email_verified_at->toISOString();
        Http::assertSent(fn(Request $request): bool => $request->method() === 'POST'
            && $request['expireAt'] === $expires
            && $request['email'] === $user->email
            && $request['username'] === $user->provisioning_key
            && $request['tag'] === 'TRIAL');
        $this->travel(5)->minutes();
        $this->get($link)->assertRedirect('/account');
        self::assertSame($verifiedAt, $user->refresh()->email_verified_at->toISOString());
        Http::assertSentCount(2);
        Event::assertDispatchedTimes(Verified::class, 1);
    }

    /**
     * Verify that invalid signature foreign user and wrong email hash cannot verify.
     *
     * @return void
     */
    public function test_invalid_signature_foreign_user_and_wrong_email_hash_cannot_verify(): void
    {
        $user = User::factory()->web()->create();
        $other = User::factory()->web()->create();
        $this->actingAs($user, 'web');
        $this->get($this->verificationUrl($user) . '&tampered=1')->assertForbidden();
        $this->get($this->verificationUrl($other))->assertForbidden();
        $this
            ->get(URL::temporarySignedRoute(
                'verification.verify',
                now()->addHour(),
                ['id' => $user->id, 'hash' => sha1('other@example.test')],
            ))
            ->assertForbidden();
        self::assertFalse($user->refresh()->hasVerifiedEmail());
        self::assertFalse($other->refresh()->hasVerifiedEmail());
        Http::assertNothingSent();
    }

    /**
     * Verify that expired link cannot verify or issue a trial.
     *
     * @return void
     */
    public function test_expired_link_cannot_verify_or_issue_a_trial(): void
    {
        $user = User::factory()->web()->create();
        $link = $this->verificationUrl($user);
        $this->travel(61)->minutes();
        $this->actingAs($user, 'web')->get($link)->assertForbidden();
        self::assertFalse($user->refresh()->hasVerifiedEmail());
        Http::assertNothingSent();
    }

    /**
     * Verify that link stops working if the email changes.
     *
     * @return void
     */
    public function test_link_stops_working_if_the_email_changes(): void
    {
        $user = User::factory()->web()->create();
        $link = $this->verificationUrl($user);
        $user->forceFill(['email' => 'changed@example.test'])->save();
        $this->actingAs($user, 'web')->get($link)->assertForbidden();
        self::assertFalse($user->refresh()->hasVerifiedEmail());
        Http::assertNothingSent();
    }

    /**
     * Verify that verification routes require the web guard and retain login intent.
     *
     * @return void
     */
    public function test_verification_routes_require_the_web_guard_and_retain_login_intent(): void
    {
        $user = User::factory()->web()->create();
        $link = $this->verificationUrl($user);
        Auth::guard('moonshine')->setUser(User::factory()->create());
        $this->get('/email/verify')->assertRedirect('/login');
        $this->post('/email/verification-notification')->assertRedirect('/login');
        $this->get($link)->assertRedirect('/login');
        $this->post('/login', ['email' => $user->email, 'password' => 'password123'])->assertRedirect($link);
        $this->fakeRemote($user);
        $this->get($link)->assertRedirect('/account');
        Http::assertSentCount(2);
    }

    /**
     * Verify that resending is authenticated and limited per user even if the ip changes.
     *
     * @return void
     */
    public function test_resending_is_authenticated_and_limited_per_user_even_if_the_ip_changes(): void
    {
        $user = User::factory()->web()->create();
        $this->actingAs($user, 'web')->post('/email/verification-notification')
            ->assertRedirect('/email/verify')->assertSessionHas('status', 'verification-link-sent');
        $this
            ->withServerVariables(['REMOTE_ADDR' => '192.0.2.20'])
            ->post('/email/verification-notification')
            ->assertSessionHasErrors('form');
        Notification::assertSentToTimes($user, WebVerifyEmail::class, 1);
        $this->travel(61)->seconds();
        $this->post('/email/verification-notification')->assertSessionHasNoErrors();
        Notification::assertSentToTimes($user, WebVerifyEmail::class, 2);
        Http::assertNothingSent();
    }

    /**
     * Verify that telegram identity cannot request an email notification.
     *
     * @return void
     */
    public function test_telegram_identity_cannot_request_an_email_notification(): void
    {
        $this->actingAs(User::factory()->create(), 'web')->get('/email/verify')->assertForbidden();
        $this->post('/email/verification-notification')->assertForbidden();
        Notification::assertNothingSent();
        Http::assertNothingSent();
    }

    /**
     * Verify that verified user is redirected without sending another message.
     *
     * @return void
     */
    public function test_verified_user_is_redirected_without_sending_another_message(): void
    {
        $user = User::factory()->web()->verified()->create();
        $this->actingAs($user, 'web')->get('/email/verify')->assertRedirect('/account');
        $this->post('/email/verification-notification')->assertRedirect('/account');
        Notification::assertNothingSent();
        Http::assertNothingSent();
    }

    /**
     * Verify that mail outage preserves registration session and allows a later resend.
     *
     * @return void
     */
    public function test_mail_outage_preserves_registration_session_and_allows_a_later_resend(): void
    {
        Notification::shouldReceive('send')->once()->andThrow(new RuntimeException('SMTP unavailable'));
        $this->post(
            '/register',
            ['email' => 'dude@example.test', 'password' => 'password123', 'password_confirmation' => 'password123'],
        )
            ->assertRedirect('/email/verify')->assertSessionHasErrors('form')->assertSessionMissing('status');
        $user = User::query()->where('email', 'dude@example.test')->sole();
        $this->assertAuthenticatedAs($user, 'web');
        self::assertFalse($user->hasVerifiedEmail());
        self::assertSame(ProvisioningState::Pending, $user->provisioning_state);
        Notification::fake();
        $this
            ->post('/email/verification-notification')
            ->assertSessionHasNoErrors()
            ->assertSessionHas('status', 'verification-link-sent');
        Notification::assertSentTo($user, WebVerifyEmail::class);
        Http::assertNothingSent();
    }

    /**
     * Verify that log transport never claims a verification email was sent.
     *
     * @return void
     */
    public function test_log_transport_never_claims_a_verification_email_was_sent(): void
    {
        config(['mail.default' => 'log']);
        $this->post(
            '/register',
            ['email' => 'dude@example.test', 'password' => 'password123', 'password_confirmation' => 'password123'],
        )
            ->assertRedirect('/email/verify')->assertSessionHasErrors('form')->assertSessionMissing('status');
        $this->post('/email/verification-notification')->assertSessionHasErrors('form')->assertSessionMissing('status');
        Notification::assertNothingSent();
        Http::assertNothingSent();
    }

    /**
     * Verify that remote failure after verification remains retryable without extending the trial.
     *
     * @return void
     */
    public function test_remote_failure_after_verification_remains_retryable_without_extending_the_trial(): void
    {
        $this->freezeTime();
        $user = User::factory()->web()->create();
        $this->fakeRemote($user, failures: 1);
        $this->actingAs($user, 'web')->get($this->verificationUrl($user))->assertRedirect('/account');
        self::assertTrue($user->refresh()->hasVerifiedEmail());
        self::assertSame(ProvisioningState::ServiceError, $user->provisioning_state);
        $expires = $user->email_verified_at->copy()->addDays(3)->utc()->toISOString();
        $key = $user->provisioning_key;
        $this
            ->get('/account')
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page->component('Account/Dashboard')
                ->where('serviceState', 'service_error')->where('provisioningRequired', true));
        $this->travel(2)->hours();
        $this->post('/account/provisioning')->assertRedirect('/account');
        self::assertSame($key, $user->refresh()->provisioning_key);
        self::assertSame(ProvisioningState::Ready, $user->provisioning_state);
        Http::assertSent(fn(Request $request): bool => $request->method() === 'POST' && $request['expireAt'] === $expires);
    }

    /**
     * Verify that existing remote account is not recreated or given another trial.
     *
     * @return void
     */
    public function test_existing_remote_account_is_not_recreated_or_given_another_trial(): void
    {
        $user = User::factory()
            ->web()
            ->create(['remnawave_user_id' => 42, 'provisioning_state' => ProvisioningState::Ready]);
        $this->actingAs($user, 'web')->get('/account')->assertRedirect('/email/verify');
        $this->get($this->verificationUrl($user))->assertRedirect('/account');
        self::assertTrue($user->refresh()->hasVerifiedEmail());
        self::assertSame(42, $user->remnawave_user_id);
        Http::assertNothingSent();
    }

    /**
     * Verify that password recovery does not bypass email verification.
     *
     * @return void
     */
    public function test_password_recovery_does_not_bypass_email_verification(): void
    {
        $user = User::factory()->web()->create();
        $token = Password::broker('users')->createToken($user);
        $this
            ->post('/reset-password', [
                'email' => $user->email,
                'token' => $token,
                'password' => 'new-password123',
                'password_confirmation' => 'new-password123',
            ])
            ->assertRedirect('/login');
        $this
            ->post('/login', ['email' => $user->email, 'password' => 'new-password123'])
            ->assertRedirect('/email/verify');
        self::assertFalse($user->refresh()->hasVerifiedEmail());
        $this->post('/account/provisioning')->assertRedirect('/email/verify');
        Http::assertNothingSent();
    }

    /**
     * Verify that notification contains the framework signed url and configured expiry.
     *
     * @return void
     */
    public function test_notification_contains_the_framework_signed_url_and_configured_expiry(): void
    {
        config(['auth.verification.expire' => 42]);
        $this->freezeTime();
        $user = User::factory()->web()->create();
        $mail = new WebVerifyEmail()->toMail($user);
        self::assertSame('Подтверди email для dudeweb', $mail->subject);
        self::assertStringContainsString('/email/verify/' . $user->id . '/' . sha1($user->email), $mail->actionUrl);
        self::assertStringContainsString('signature=', $mail->actionUrl);
        self::assertStringContainsString('expires=' . now()->addMinutes(42)->timestamp, $mail->actionUrl);
        self::assertStringContainsString('42', implode(' ', $mail->outroLines));
    }

    /**
     * Verify that verification migration can be rolled back and reapplied.
     *
     * @return void
     */
    public function test_verification_migration_can_be_rolled_back_and_reapplied(): void
    {
        $migration = require database_path('migrations/2026_10_19_203511_add_email_verified_at_to_users_table.php');
        $migration->down();
        self::assertFalse(Schema::hasColumn('users', 'email_verified_at'));
        $migration->up();
        self::assertTrue(Schema::hasColumn('users', 'email_verified_at'));
    }

    /**
     * Создаёт временную подписанную ссылку подтверждения email для теста.
     *
     * @param User $user
     *
     * @return string
     */
    private function verificationUrl(User $user): string
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            now()->addHour(),
            ['id' => $user->id, 'hash' => sha1($user->email)],
        );
    }

    /**
     * Подменяет ответы Remnawave и заданное число временных сбоев.
     *
     * @param User $user
     * @param int $failures
     *
     * @return void
     */
    private function fakeRemote(User $user, int $failures = 0): void
    {
        Http::fake(function (Request $request) use ($user, &$failures) {
            if ($failures > 0) {
                $failures--;

                return Http::response(['message' => 'unavailable'], 503);
            }

            if ($request->method() === 'GET') {
                return Http::response(['message' => 'not found'], 404);
            }

            return Http::response(['response' => [
                'id' => 42,
                'shortUuid' => 'short',
                'username' => $user->provisioning_key,
                'email' => $user->email,
                'status' => 'ACTIVE',
                'trafficLimitBytes' => 32212254720,
                'trafficLimitStrategy' => 'NO_RESET',
                'expireAt' => $request['expireAt'],
                'telegramId' => null,
                'tag' => 'TRIAL',
                'trojanPassword' => 'remote-secret',
                'vlessUuid' => '00000000-0000-4000-8000-000000000002',
                'ssPassword' => 'remote-secret',
                'createdAt' => now()->toISOString(),
                'updatedAt' => now()->toISOString(),
                'subscriptionUrl' => 'https://example.test/sub',
                'activeInternalSquads' => [],
                'lastTriggeredThreshold' => 0,
                'userTraffic' => ['usedTrafficBytes' => 0, 'lifetimeUsedTrafficBytes' => 0],
            ]], 201);
        });
    }
}
