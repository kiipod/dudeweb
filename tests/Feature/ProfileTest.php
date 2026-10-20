<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\WebVerifyEmail;
use App\Services\Profile\ProfileService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;
use RuntimeException;
use Tests\TestCase;

final class ProfileTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Изолирует external API и почту от security tests.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        Notification::fake();
        Http::preventStrayRequests();
    }

    /**
     * Проверяет guest/unverified boundaries всех profile endpoints.
     *
     * @return void
     */
    public function test_profile_requires_verified_web_session(): void
    {
        $this->get('/account/profile')->assertRedirect('/login');
        $this->patchJson('/account/profile')->assertUnauthorized();
        $this->putJson('/account/profile/password')->assertUnauthorized();
        $this->deleteJson('/account/profile/sessions')->assertUnauthorized();
        $this->actingAs(User::factory()->web()->create(), 'web')->get('/account/profile')->assertRedirect('/email/verify');
        $this->patch('/account/profile')->assertRedirect('/email/verify');
    }

    /**
     * Выдаёт только текущий профиль без secret/provider ID, даже при forged query ID.
     *
     * @return void
     */
    public function test_profile_returns_safe_owned_data_and_local_only_theme(): void
    {
        $owner = $this->customer();
        $other = $this->customer();
        $this->actingAs($owner, 'web')->get('/account/profile?user_id=' . $other->id)->assertOk()
            ->assertHeader('Cache-Control', 'no-store, private')
            ->assertViewHas('page', fn(array $page): bool => $page['encryptHistory'] === true)
            ->assertInertia(fn(Assert $p) => $p->component('Account/Profile')->where('user.email', $owner->email)
                ->where('user.firstName', $owner->first_name)->where('telegramConnection.connected', false)
                ->where('securityCapabilities.password', true)->where('securityCapabilities.changeEmail', true)
                ->where('themePreference.choices', ['light', 'dark'])->where('themePreference.storage', 'local')
                ->missing('user.password')->missing('user.id')->missing('user.remnawave_user_id')->missing('user.provisioning_key'));
        $this->get('/account/profile/' . $other->id)->assertNotFound();
    }

    /**
     * Обновляет own names, игнорирует identity/status/owner/theme controls из payload.
     *
     * @return void
     */
    public function test_name_update_is_owned_and_preserves_verified_identity(): void
    {
        $owner = $this->customer();
        $other = $this->customer();
        $hash = $owner->password;
        $verified = $owner->email_verified_at;
        $this->actingAs($owner, 'web')->patch('/account/profile', [
            'first_name' => 'Иван', 'last_name' => null, 'email' => strtoupper($owner->email),
            'user_id' => $other->id, 'password' => 'attacker', 'chat_id' => 999,
            'remnawave_user_id' => 999, 'theme' => 'dark', 'email_verified_at' => null,
        ])->assertRedirect('/account/profile')->assertSessionHasNoErrors();
        $owner->refresh();
        self::assertSame('Иван', $owner->first_name);
        self::assertNull($owner->last_name);
        self::assertSame($hash, $owner->password);
        self::assertTrue($owner->email_verified_at->equalTo($verified));
        self::assertNull($owner->chat_id);
        self::assertNotSame(999, $owner->remnawave_user_id);
        self::assertNotSame('Иван', $other->fresh()->first_name);
        self::assertArrayNotHasKey('theme', $owner->getAttributes());
        Notification::assertNothingSent();
    }

    /**
     * Нормализует email и проверяет уникальность/current password до записи.
     *
     * @return void
     */
    public function test_profile_validation_prevents_duplicate_or_unproved_email_change(): void
    {
        $owner = $this->customer();
        $other = $this->customer();
        $this->actingAs($owner, 'web')->patchJson('/account/profile', ['email' => strtoupper($other->email), 'current_password' => 'password123'])
            ->assertUnprocessable()->assertJsonValidationErrors('email');
        $this->patchJson('/account/profile', ['email' => 'new@example.test', 'current_password' => 'wrong'])
            ->assertJsonValidationErrors('current_password');
        $this->patchJson('/account/profile', ['email' => 'broken', 'first_name' => str_repeat('x', 256)])
            ->assertJsonValidationErrors(['email', 'first_name']);
        self::assertSame($owner->email, $owner->fresh()->email);
        Notification::assertNothingSent();
    }

    /**
     * Смена адреса сбрасывает verification, но сохраняет mapping/entitlement и отзывает reset links.
     *
     * @return void
     */
    public function test_email_change_requires_new_verification_without_reprovisioning(): void
    {
        $owner = $this->customer();
        $remoteId = $owner->remnawave_user_id;
        $oldUrl = URL::temporarySignedRoute('verification.verify', now()->addHour(), ['id' => $owner->id, 'hash' => sha1($owner->email)]);
        DB::table('password_reset_tokens')->insert(['email' => $owner->email, 'token' => Hash::make('old'), 'created_at' => now()]);
        $this->actingAs($owner, 'web')->patch('/account/profile', ['email' => '  NEW@EXAMPLE.TEST  ', 'current_password' => 'password123'])
            ->assertRedirect('/email/verify')->assertSessionHas('status', 'verification-link-sent');
        $owner->refresh();
        self::assertSame('new@example.test', $owner->email);
        self::assertNull($owner->email_verified_at);
        self::assertSame($remoteId, $owner->remnawave_user_id);
        self::assertNotNull($owner->first_name);
        $this->assertDatabaseCount('password_reset_tokens', 0);
        Notification::assertSentTo($owner, WebVerifyEmail::class);
        $this->get('/email/verify')->assertInertia(fn(Assert $p) => $p->where('existingAccount', true));
        $this->get('/account/profile')->assertRedirect('/email/verify');
        $this->get($oldUrl)->assertForbidden();
        $newUrl = URL::temporarySignedRoute('verification.verify', now()->addHour(), ['id' => $owner->id, 'hash' => sha1($owner->email)]);
        $this->get($newUrl)->assertRedirect();
        $this->get('/account/profile')->assertOk();
        Http::assertNothingSent();
    }

    /**
     * Failed SMTP не откатывает сохранённый адрес и не сообщает fake delivery success.
     *
     * @return void
     */
    public function test_email_delivery_failure_remains_retryable_after_local_save(): void
    {
        config(['mail.default' => 'log', 'mail.mailers.log.transport' => 'log']);
        $owner = $this->customer();
        $this->actingAs($owner, 'web')->patch('/account/profile', ['email' => 'new@example.test', 'current_password' => 'password123'])
            ->assertRedirect('/email/verify')->assertSessionHasErrors('form');
        self::assertSame('new@example.test', $owner->fresh()->email);
        self::assertNull($owner->fresh()->email_verified_at);
        Notification::assertNothingSent();
    }

    /**
     * Не теряет ownership proof незавершённого remote provisioning при смене адреса.
     *
     * @return void
     */
    public function test_pending_provisioning_allows_names_but_not_email_change(): void
    {
        $owner = $this->customer(['remnawave_user_id' => null]);
        $this->actingAs($owner, 'web')->get('/account/profile')->assertInertia(fn(Assert $p) => $p->where('securityCapabilities.changeEmail', false));
        $this->patch('/account/profile', ['email' => $owner->email, 'first_name' => 'Новое имя'])->assertSessionHasNoErrors();
        $this->patch('/account/profile', ['email' => 'new@example.test', 'current_password' => 'password123'])->assertSessionHasErrors('email');
        self::assertSame($owner->email, $owner->fresh()->email);
        self::assertSame('Новое имя', $owner->fresh()->first_name);
    }

    /**
     * Проверяет wrong current/mismatch/minimum/bcrypt byte limits и неизменность hash.
     *
     * @return void
     */
    public function test_password_validation_preserves_credentials(): void
    {
        $owner = $this->customer();
        $hash = $owner->password;
        $this->actingAs($owner, 'web')->putJson('/account/profile/password', ['current_password' => 'wrong', 'password' => 'newPassword123', 'password_confirmation' => 'mismatch'])
            ->assertJsonValidationErrors(['current_password', 'password']);
        $this->putJson('/account/profile/password', ['current_password' => 'password123', 'password' => 'short', 'password_confirmation' => 'short'])->assertJsonValidationErrors('password');
        $this->putJson('/account/profile/password', ['current_password' => 'password123', 'password' => str_repeat('я', 37), 'password_confirmation' => str_repeat('я', 37)])->assertJsonValidationErrors('password');
        self::assertSame($hash, $owner->fresh()->password);
    }

    /**
     * Меняет пароль, current session ID и remember token, очищает reset links без потери текущего login.
     *
     * @return void
     */
    public function test_password_change_preserves_current_session_and_revokes_old_credentials(): void
    {
        $owner = $this->customer(['remember_token' => 'old-remember-token']);
        DB::table('password_reset_tokens')->insert(['email' => $owner->email, 'token' => Hash::make('old'), 'created_at' => now()]);
        $this->actingAs($owner, 'web')->get('/account/profile');
        $oldSession = session()->getId();
        $this->put('/account/profile/password', ['current_password' => 'password123', 'password' => 'newPassword123', 'password_confirmation' => 'newPassword123'])
            ->assertRedirect('/account/profile')->assertSessionHasNoErrors();
        $owner->refresh();
        self::assertTrue(Hash::check('newPassword123', $owner->password));
        self::assertFalse(Hash::check('password123', $owner->password));
        self::assertNotSame('old-remember-token', $owner->remember_token);
        self::assertNotSame($oldSession, session()->getId());
        $this->assertDatabaseCount('password_reset_tokens', 0);
        $this->get('/account/profile')->assertOk();
        $this->assertAuthenticatedAs($owner, 'web');
    }

    /**
     * Проверяет реальный auth.session rejection старой второй сессии после смены пароля.
     *
     * @return void
     */
    public function test_old_session_hash_is_rejected_on_next_protected_request(): void
    {
        $owner = $this->customer();
        $oldHash = $owner->password;
        app(ProfileService::class)->password($owner, 'password123', 'newPassword123');
        $this->actingAs($owner->fresh(), 'web')->withSession(['password_hash_web' => $oldHash])->get('/account/profile')->assertRedirect('/login');
        $this->assertGuest('web');
    }

    /**
     * Отзывает другие сессии без смены plaintext и требует password proof.
     *
     * @return void
     */
    public function test_end_other_sessions_rotates_hash_and_keeps_current_login(): void
    {
        $owner = $this->customer();
        $hash = $owner->password;
        $this->actingAs($owner, 'web')->deleteJson('/account/profile/sessions', ['current_password' => 'wrong'])->assertJsonValidationErrors('current_password');
        $this->delete('/account/profile/sessions', ['current_password' => 'password123'])->assertRedirect('/account/profile');
        $owner->refresh();
        self::assertNotSame($hash, $owner->password);
        self::assertTrue(Hash::check('password123', $owner->password));
        $this->get('/account/profile')->assertOk();
    }

    /**
     * Passwordless identity и Telegram linkage остаются честными read-only capabilities.
     *
     * @return void
     */
    public function test_passwordless_account_has_no_broken_security_action(): void
    {
        $owner = $this->customer(['password' => null, 'chat_id' => 12345, 'username' => 'real_user']);
        $this->actingAs($owner, 'web')->get('/account/profile')->assertInertia(fn(Assert $p) => $p->where('securityCapabilities.password', false)
            ->where('securityCapabilities.changeEmail', false)->where('telegramConnection.connected', true)->where('telegramConnection.username', 'real_user'));
        $this->putJson('/account/profile/password')->assertForbidden();
        $this->deleteJson('/account/profile/sessions')->assertForbidden();
    }

    /**
     * Ошибка storage не меняет identity и не раскрывает private exception/secret input.
     *
     * @return void
     */
    public function test_profile_storage_failure_is_safe_and_retryable(): void
    {
        Log::spy();
        $owner = $this->customer();
        $this->mock(ProfileService::class, fn($mock) => $mock->shouldReceive('update')->andThrow(new RuntimeException('private database details')));
        $this->actingAs($owner, 'web')->patch('/account/profile', ['email' => $owner->email, 'first_name' => 'Не сохранится'])
            ->assertRedirect('/account/profile')->assertSessionHasErrors('form')->assertSessionMissing('_old_input.current_password');
        self::assertNotSame('Не сохранится', $owner->fresh()->first_name);
        Log::shouldHaveReceived('warning')->with('Profile operation failed.', ['exception' => RuntimeException::class]);
    }

    /**
     * Validation flash никогда не содержит пароли и confirmation.
     *
     * @return void
     */
    public function test_passwords_are_not_flashed_on_validation_failure(): void
    {
        $this->actingAs($this->customer(), 'web')->put('/account/profile/password', ['current_password' => 'secret', 'password' => 'newPassword123', 'password_confirmation' => 'other'])
            ->assertSessionHasErrors()->assertSessionMissing('_old_input.current_password')
            ->assertSessionMissing('_old_input.password')->assertSessionMissing('_old_input.password_confirmation');
    }

    /**
     * Logout использует DELETE, очищает current session/history и отвергает GET.
     *
     * @return void
     */
    public function test_profile_logout_clears_session_and_encrypted_history(): void
    {
        $owner = $this->customer();
        $this->actingAs($owner, 'web')->get('/logout')->assertMethodNotAllowed();
        $this->delete('/logout')->assertRedirect('/');
        $this->assertGuest('web');
        $this->get('/account/profile')->assertRedirect('/login');
    }

    /**
     * С реальным CSRF middleware logout и profile mutations отвергают отсутствующий token.
     *
     * @return void
     */
    public function test_profile_and_logout_reject_missing_csrf_token(): void
    {
        $this->actingAs($this->customer(), 'web');
        $environment = app()->environment();
        app()->instance('env', 'local');
        try {
            $this->delete('/logout')->assertStatus(419);
            $this->patch('/account/profile', ['email' => 'new@example.test'])->assertStatus(419);
            $this->put('/account/profile/password')->assertStatus(419);
        } finally {
            app()->instance('env', $environment);
        }
        $this->assertAuthenticated('web');
    }

    /**
     * Старый remember cookie не восстанавливает вход после смены credentials.
     *
     * @return void
     */
    public function test_old_remember_cookie_cannot_restore_revoked_credentials(): void
    {
        $owner = $this->customer(['remember_token' => 'old-token']);
        $guard = Auth::guard('web');
        $recaller = $owner->id . '|old-token|' . $guard->hashPasswordForCookie($owner->password);
        app(ProfileService::class)->password($owner, 'password123', 'newPassword123');
        $this->withCookie($guard->getRecallerName(), $recaller)->get('/account/profile')->assertRedirect('/login');
        $this->assertGuest('web');
    }

    /**
     * Создаёт подтверждённого владельца с существующим numeric mapping.
     *
     * @param array<string, mixed> $attributes
     *
     * @return User
     */
    private function customer(array $attributes = []): User
    {
        return User::factory()->web()->verified()->create(array_replace(['remnawave_user_id' => fake()->unique()->numberBetween(1000, 999999)], $attributes));
    }
}
