<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\WebPasswordReset;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

final class PasswordRecoveryTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Verify that known and unknown email have the same generic response.
     *
     * @return void
     */
    public function test_known_and_unknown_email_have_the_same_generic_response(): void
    {
        Notification::fake();
        $user = User::factory()->web()->create(['email' => 'dude@example.test']);
        foreach (['DUDE@EXAMPLE.TEST', 'unknown@example.test'] as $email) {
            $this
                ->post('/forgot-password', ['email' => $email])
                ->assertRedirect('/forgot-password')
                ->assertSessionHas('status', 'reset-link-requested')
                ->assertSessionHasNoErrors();
        }
        Notification::assertSentTo($user, WebPasswordReset::class);
        $token = DB::table('password_reset_tokens')->where('email', $user->email)->value('token');
        self::assertNotEmpty($token);
        $this->get('/forgot-password')->assertInertia(fn(Assert $page) => $page->where('linkRequested', true));
    }

    /**
     * Verify that notification uses real broker token correct route and expiry.
     *
     * @return void
     */
    public function test_notification_uses_real_broker_token_correct_route_and_expiry(): void
    {
        Notification::fake();
        config(['auth.defaults.passwords' => 'moonshine', 'auth.passwords.users.expire' => 42]);
        $user = User::factory()->web()->create();
        $this->post('/forgot-password', ['email' => $user->email])->assertSessionHasNoErrors();
        Notification::assertSentTo(
            $user,
            WebPasswordReset::class,
            function (WebPasswordReset $notification) use ($user): bool {
                self::assertTrue(Password::broker('users')->tokenExists($user, $notification->token));
                $mail = $notification->toMail($user);
                self::assertStringContainsString('/reset-password/' . $notification->token, $mail->actionUrl);
                self::assertStringContainsString('42', implode(' ', $mail->outroLines));
                return true;
            },
        );
    }

    /**
     * Verify that log only transport reports unavailability for every identity.
     *
     * @return void
     */
    public function test_log_only_transport_reports_unavailability_for_every_identity(): void
    {
        Notification::fake();
        config(['mail.default' => 'log']);
        $user = User::factory()->web()->create();
        foreach ([$user->email, 'unknown@example.test'] as $email) {
            $this
                ->post('/forgot-password', ['email' => $email])
                ->assertSessionHasErrors('form')
                ->assertSessionMissing('status');
        }
        Notification::assertNothingSent();
        $this->assertDatabaseCount('password_reset_tokens', 0);
    }

    /**
     * Verify that recovery throttle applies to unknown identities too.
     *
     * @return void
     */
    public function test_recovery_throttle_applies_to_unknown_identities_too(): void
    {
        for ($i = 0; $i < 3; $i++) {
            $this->post('/forgot-password', ['email' => 'unknown@example.test'])->assertSessionHasNoErrors();
        }
        $this->post('/forgot-password', ['email' => ' UNKNOWN@EXAMPLE.TEST '])->assertSessionHasErrors('form');
    }

    /**
     * Verify that delivery failure does not reveal a known identity or claim success.
     *
     * @return void
     */
    public function test_delivery_failure_does_not_reveal_a_known_identity_or_claim_success(): void
    {
        $user = User::factory()->web()->create();
        Notification::shouldReceive('send')->once()->andThrow(new \RuntimeException('Simulated mail outage'));
        foreach ([$user->email, 'unknown@example.test'] as $email) {
            $this->post('/forgot-password', ['email' => $email])
                ->assertRedirect('/forgot-password')->assertSessionHas('status', 'reset-link-requested')
            ->assertSessionHasNoErrors();
        }
    }

    /**
     * Verify that valid token changes password rotates remember token and cannot be reused.
     *
     * @return void
     */
    public function test_valid_token_changes_password_rotates_remember_token_and_cannot_be_reused(): void
    {
        $user = User::factory()->web()->create(['remember_token' => 'old-token']);
        $token = Password::broker('users')->createToken($user);
        $this
            ->post('/reset-password', $this->resetData($user, $token))
            ->assertRedirect('/login')
            ->assertSessionHas('status', 'password-changed');
        self::assertTrue(Hash::check('new-password123', $user->refresh()->password));
        self::assertNotSame('old-token', $user->remember_token);
        $this->assertGuest('web');
        $this->get('/login')->assertInertia(fn(Assert $page) => $page->where('passwordChanged', true));
        $this->post('/reset-password', $this->resetData($user, $token))->assertSessionHasErrors('email');
        $this->assertDatabaseCount('password_reset_tokens', 0);
    }

    /**
     * Verify that invalid expired and unknown tokens never change password.
     *
     * @return void
     */
    public function test_invalid_expired_and_unknown_tokens_never_change_password(): void
    {
        $user = User::factory()->web()->create();
        $this->post('/reset-password', $this->resetData($user, 'invalid'))->assertSessionHasErrors('email');
        $token = Password::broker('users')->createToken($user);
        $this->travel(61)->minutes();
        $this->post('/reset-password', $this->resetData($user, $token))->assertSessionHasErrors('email');
        $this->travelBack();
        $this
            ->post('/reset-password', [...$this->resetData($user, $token), 'email' => 'unknown@example.test'])
            ->assertSessionHasErrors('email');
        self::assertTrue(Hash::check('password123', $user->refresh()->password));
    }

    /**
     * Verify that password confirmation is required and secrets are not flashed.
     *
     * @return void
     */
    public function test_password_confirmation_is_required_and_secrets_are_not_flashed(): void
    {
        $user = User::factory()->web()->create();
        $token = Password::broker('users')->createToken($user);
        $this->post('/reset-password', [...$this->resetData($user, $token), 'password_confirmation' => 'wrong'])
            ->assertSessionHasErrors('password')->assertSessionMissing('_old_input.password')
        ->assertSessionMissing('_old_input.password_confirmation');
        self::assertTrue(Password::broker('users')->tokenExists($user, $token));
    }

    /**
     * Формирует данные запроса смены пароля с заданным токеном.
     *
     * @param User $user
     * @param string $token
     *
     * @return array<string, string>
     */
    private function resetData(User $user, string $token): array
    {
        return [
            'email' => $user->email,
            'token' => $token,
            'password' => 'new-password123',
            'password_confirmation' => 'new-password123',
        ];
    }
}
