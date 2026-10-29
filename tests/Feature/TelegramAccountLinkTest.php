<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Bot\Telegram\Enums\UserTags;
use App\Enums\ReferralRewardStatus;
use App\Enums\TelegramLinkState;
use App\Models\Payment;
use App\Models\Promocode;
use App\Models\ReferralInvite;
use App\Models\ReferralReward;
use App\Models\SupportMessage;
use App\Models\SupportTicket;
use App\Models\TelegramAccountLink;
use App\Models\TelegramBot;
use App\Models\User;
use App\Models\UserPromocode;
use App\Payment\Enums\PaymentStatus;
use App\Services\SubscriptionMutationLock;
use Carbon\CarbonImmutable;
use DefStudio\Telegraph\Facades\Telegraph;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

final class TelegramAccountLinkTest extends TestCase
{
    use RefreshDatabase;

    /** @var array<int, array<string, mixed>> */
    private array $remote = [];
    private ?int $failPatch = null;
    private ?int $failDelete = null;
    private TelegramBot $bot;

    /**
     * Изолирует Telegram/Remnawave и фиксирует время расчёта entitlement.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->travelTo(CarbonImmutable::parse('2026-10-26T12:00:00Z'));
        config([
            'services.telegram.bot_username' => 'dudeweb_test_bot',
            'telegraph.webhook.secret_token' => 'test-webhook-secret',
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'fake-panel-token',
        ]);
        $bot = TelegramBot::factory()->create();
        $this->bot = TelegramBot::query()->findOrFail($bot->id);
        config(['services.telegram.link_bot_id' => $this->bot->id]);
        Telegraph::fake();
        Http::preventStrayRequests();
        Http::fake(fn(Request $request) => $this->panel($request));
    }

    /**
     * Start требует authenticated verified web и не сохраняет открытый token.
     *
     * @return void
     */
    public function test_start_is_owned_csrf_post_with_hashed_single_use_proof(): void
    {
        $this->postJson('/account/profile/telegram')->assertUnauthorized();
        $user = $this->web();
        [$token, $link] = $this->start($user);
        self::assertSame(hash('sha256', $token), $link->token_hash);
        self::assertNotSame($token, $link->token_hash);
        self::assertStringNotContainsString($token, json_encode($link->getAttributes()));
        self::assertSame($user->id, $link->user_id);
        self::assertSame(32, strlen($token));
        $this->assertDatabaseCount('users', 1);
        $this->get('/account/profile')->assertInertia(fn(Assert $page) => $page
            ->where('telegramConnection.available', true)->where('telegramConnection.link.state', 'pending')
            ->missing('telegramConnection.link.token_hash')->missing('telegramConnection.link.session_hash'));
        $this->get('/account/profile/telegram')->assertMethodNotAllowed();
        $environment = app()->environment();
        app()->instance('env', 'local');
        try {
            $this->post('/account/profile/telegram')->assertStatus(419);
        } finally {
            app()->instance('env', $environment);
        }
        Http::assertNothingSent();
    }

    /**
     * Private bot consent не создаёт дополнительный User или trial.
     *
     * @return void
     */
    public function test_new_bot_identity_attaches_to_existing_web_subscription_without_new_trial(): void
    {
        $web = $this->web();
        $this->remote[101] = $this->remoteUser(101, null, $web->email, 10);
        [$token, $link] = $this->start($web);
        $this->identify($token, 5_123_456_789);
        $this->assertDatabaseCount('users', 1);
        self::assertSame(TelegramLinkState::AwaitingTelegram, $link->fresh()->state);
        $this->consent($token, 5_123_456_789);
        self::assertSame(TelegramLinkState::Ready, $link->fresh()->state);
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])
            ->assertRedirect('/account/profile')->assertSessionHasNoErrors();
        $web->refresh();
        self::assertSame(5_123_456_789, $web->chat_id);
        self::assertSame('telegram_user', $web->username);
        self::assertSame('web_nickname', $web->profile_username);
        self::assertSame(101, $web->remnawave_user_id);
        self::assertNull($web->telegram_merge_id);
        self::assertSame(TelegramLinkState::Complete, $link->fresh()->state);
        $this->assertDatabaseCount('users', 1);
        self::assertSame([101], array_keys($this->remote));
        self::assertSame(5_123_456_789, $this->remote[101]['telegramId']);
        Http::assertNotSent(fn(Request $request): bool => $request->method() === 'POST');
        $this->get('/account/profile')->assertInertia(fn(Assert $page) => $page
            ->where('telegramConnection.connected', true)->where('telegramConnection.username', 'telegram_user')
            ->where('user.username', 'web_nickname'));
        $telegraph = Telegraph::fake();
        $payload = $this->payload('', 5_123_456_789);
        $payload['message']['text'] = '/profile';
        $this->webhook($payload);
        $telegraph->assertSent('Личный кабинет пользователя', false);
        Http::assertSent(fn(Request $request): bool => str_ends_with($request->url(), '/api/hwid/devices/101'));
    }

    /**
     * Сохраняет более раннюю web subscription и складывает два оплаченных остатка.
     *
     * @return void
     */
    public function test_web_first_merge_preserves_its_credentials_and_is_idempotent(): void
    {
        $web = $this->web(['created_at' => now()->subDays(20)]);
        $telegram = $this->telegram(['created_at' => now()->subDays(10)]);
        $this->remote[101] = $this->remoteUser(101, null, $web->email, 10);
        $this->remote[202] = $this->remoteUser(202, $telegram->chat_id, null, 20);
        $credentials = $this->remote[101]['subscriptionUrl'];
        [$token, $link] = $this->start($web);
        $this->identify($token);
        $this->consent($token);
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('users', ['id' => $telegram->id]);
        self::assertSame(101, $web->fresh()->remnawave_user_id);
        self::assertSame($credentials, $this->remote[101]['subscriptionUrl']);
        self::assertTrue(CarbonImmutable::parse($this->remote[101]['expireAt'])->equalTo(now()->addDays(30)));
        self::assertArrayNotHasKey(202, $this->remote);
        $requests = Http::recorded()->count();
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasNoErrors();
        self::assertSame($requests, Http::recorded()->count());
        $this->assertAuthenticatedAs($web, 'web');
    }

    /**
     * Telegram-first сохраняет старую ссылку, все FK histories и текущий web login.
     *
     * @return void
     */
    public function test_telegram_first_transfers_both_histories_and_adopts_surviving_session_owner(): void
    {
        $telegram = $this->telegram(['created_at' => now()->subDays(20)]);
        $web = $this->web(['created_at' => now()->subDays(10)]);
        $this->remote[101] = $this->remoteUser(101, null, $web->email, 10);
        $this->remote[202] = $this->remoteUser(202, $telegram->chat_id, null, 20);
        $email = $web->email;
        $hash = $web->password;
        $paymentA = Payment::factory()->create(['user_id' => $web->id, 'status' => PaymentStatus::Succeeded]);
        $paymentB = Payment::factory()->create(['user_id' => $telegram->id, 'status' => PaymentStatus::Succeeded]);
        $codeA = Promocode::factory()->create(['user_id' => $web->id]);
        $codeB = Promocode::factory()->create(['user_id' => $telegram->id]);
        UserPromocode::query()->create(['user_id' => $web->id, 'promocode_id' => $codeA->id]);
        UserPromocode::query()->create(['user_id' => $telegram->id, 'promocode_id' => $codeB->id]);
        $inviteA = ReferralInvite::factory()->create(['remnawave_user_id' => 101]);
        $inviteB = ReferralInvite::factory()->create(['remnawave_user_id' => 202]);
        $ticket = SupportTicket::factory()->create(['user_id' => $web->id]);
        $message = SupportMessage::factory()->create(['ticket_id' => $ticket->id, 'customer_id' => $web->id]);
        $reward = ReferralReward::factory()->create([
            'referrer_user_id' => $telegram->id, 'referred_user_id' => $web->id,
            'payment_id' => $paymentA->id,
        ]);
        [$token, $link] = $this->start($web);
        $this->identify($token);
        $this->consent($token);
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasNoErrors();
        $telegram->refresh();
        self::assertSame($email, $telegram->email);
        self::assertSame($hash, $telegram->password);
        self::assertTrue(Hash::check('password123', $telegram->password));
        self::assertSame('web_nickname', $telegram->profile_username);
        self::assertSame(202, $telegram->remnawave_user_id);
        self::assertTrue(CarbonImmutable::parse($this->remote[202]['expireAt'])->equalTo(now()->addDays(30)));
        self::assertSame('https://sub.test/202', $this->remote[202]['subscriptionUrl']);
        $this->assertDatabaseMissing('users', ['id' => $web->id]);
        self::assertSame($telegram->id, $paymentA->fresh()->user_id);
        self::assertSame($telegram->id, $paymentB->fresh()->user_id);
        self::assertSame($telegram->id, $ticket->fresh()->user_id);
        self::assertSame($telegram->id, $message->fresh()->customer_id);
        self::assertSame(202, $inviteA->fresh()->remnawave_user_id);
        self::assertSame(202, $inviteB->fresh()->remnawave_user_id);
        self::assertSame(2, UserPromocode::query()->where('user_id', $telegram->id)->count());
        self::assertSame(ReferralRewardStatus::Conflict, $reward->fresh()->status);
        self::assertSame($telegram->id, $link->fresh()->user_id);
        $this->assertAuthenticatedAs($telegram, 'web');
        $this->get('/account/profile')->assertOk()->assertInertia(fn(Assert $page) => $page->where('user.email', $email));
    }

    /**
     * Старый local Telegram account без numeric mapping получает stable mapping.
     *
     * @return void
     */
    public function test_legacy_telegram_mapping_is_resolved_before_merging(): void
    {
        $telegram = $this->telegram(['remnawave_user_id' => null, 'created_at' => now()->subDays(20)]);
        $web = $this->web();
        $this->remote[101] = $this->remoteUser(101, null, $web->email, 10);
        $this->remote[202] = $this->remoteUser(202, $telegram->chat_id, null, 20);
        $this->remote[202]['username'] = 'old_telegram_username';
        [$token, $link] = $this->start($web);
        $this->identify($token);
        $this->consent($token);
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasNoErrors();
        self::assertSame(202, $telegram->fresh()->remnawave_user_id);
        $this->assertAuthenticatedAs($telegram, 'web');
        Http::assertSent(fn(Request $request): bool => str_contains($request->url(), '/api/users/stream')
            && (string) $request['telegramId'] === (string) $telegram->chat_id);
        Http::assertNotSent(fn(Request $request): bool => str_contains($request->url(), '/by-username/'));
    }

    /**
     * Неоднозначная legacy identity не должна удалять одну из оплаченных подписок.
     *
     * @return void
     */
    public function test_duplicate_legacy_remote_identities_require_reconciliation_without_mutations(): void
    {
        $telegram = $this->telegram(['remnawave_user_id' => null, 'created_at' => now()->subDays(20)]);
        $web = $this->web();
        $this->remote[101] = $this->remoteUser(101, null, $web->email, 10);
        $this->remote[202] = $this->remoteUser(202, $telegram->chat_id, null, 20);
        $this->remote[203] = $this->remoteUser(203, $telegram->chat_id, null, 15);
        [$token, $link] = $this->start($web);
        $this->identify($token);
        $this->consent($token);
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasErrors('telegram');
        self::assertSame(TelegramLinkState::Applying, $link->fresh()->state);
        self::assertNull($link->fresh()->plan);
        $this->assertDatabaseCount('users', 2);
        self::assertCount(3, $this->remote);
        Http::assertNotSent(fn(Request $request): bool => $request->method() !== 'GET');
    }

    /**
     * Ambiguous PATCH повторяет сохранённый абсолютный target без новых дней.
     *
     * @return void
     */
    public function test_ambiguous_remote_update_resumes_once_without_double_credit(): void
    {
        $web = $this->web(['created_at' => now()->subDays(20)]);
        $telegram = $this->telegram();
        $this->remote[101] = $this->remoteUser(101, null, $web->email, 10);
        $this->remote[202] = $this->remoteUser(202, $telegram->chat_id, null, 20);
        [$token, $link] = $this->start($web);
        $this->identify($token);
        $this->consent($token);
        $this->failPatch = 101;
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasErrors('telegram');
        $link->refresh();
        self::assertSame(TelegramLinkState::Applying, $link->state);
        self::assertSame($link->id, $web->fresh()->telegram_merge_id);
        $target = $link->plan['target_expires_at'];
        $this->assertDatabaseHas('users', ['id' => $telegram->id]);
        $this->travel(15)->minutes();
        $this->artisan('telegram-links:resume')->assertSuccessful();
        self::assertSame(TelegramLinkState::Complete, $link->fresh()->state);
        self::assertSame($target, $this->remote[101]['expireAt']);
        self::assertNull($web->fresh()->telegram_merge_id);
        self::assertCount(1, $this->remote);
    }

    /**
     * Cleanup failure после local commit сохраняет новый web login и допускает 404 retry.
     *
     * @return void
     */
    public function test_ambiguous_delete_recovers_after_local_survivor_changed(): void
    {
        $telegram = $this->telegram(['created_at' => now()->subDays(20)]);
        $web = $this->web();
        $this->remote[101] = $this->remoteUser(101, null, $web->email, 10);
        $this->remote[202] = $this->remoteUser(202, $telegram->chat_id, null, 20);
        [$token, $link] = $this->start($web);
        $this->identify($token);
        $this->consent($token);
        $this->failDelete = 101;
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasErrors('telegram');
        self::assertSame(TelegramLinkState::LocalApplied, $link->fresh()->state);
        $this->assertAuthenticatedAs($telegram->fresh(), 'web');
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasNoErrors();
        self::assertSame(TelegramLinkState::Complete, $link->fresh()->state);
        self::assertNull($telegram->fresh()->telegram_merge_id);
    }

    /**
     * Два trial не складываются и не становятся платной подпиской.
     *
     * @return void
     */
    public function test_trial_periods_are_not_added_together(): void
    {
        $web = $this->web(['created_at' => now()->subDays(20)]);
        $telegram = $this->telegram();
        $this->remote[101] = $this->remoteUser(101, null, $web->email, 2, 'TRIAL');
        $this->remote[202] = $this->remoteUser(202, $telegram->chat_id, null, 3, 'TRIAL');
        [$token, $link] = $this->start($web);
        $this->identify($token);
        $this->consent($token);
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasNoErrors();
        self::assertTrue(CarbonImmutable::parse($this->remote[101]['expireAt'])->equalTo(now()->addDays(3)));
        self::assertSame('TRIAL', $this->remote[101]['tag']);
    }

    /**
     * Webhook secret, bot ID, private sender и token expiry проверяются до binding.
     *
     * @return void
     */
    public function test_proof_cannot_be_forged_replayed_or_used_by_another_telegram_sender(): void
    {
        $web = $this->web();
        [$token, $link] = $this->start($web);
        $this->postJson('/telegraph/' . $this->bot->token . '/webhook', $this->payload($token, 123_456))
            ->assertForbidden();
        self::assertSame(TelegramLinkState::Pending, $link->fresh()->state);
        $this->identify($token);
        $payload = $this->payload($token, 123_456, true);
        $payload['callback_query']['from']['id'] = 999_999;
        $this->webhook($payload);
        self::assertSame(TelegramLinkState::AwaitingTelegram, $link->fresh()->state);
        $this->consent($token);
        $this->consent($token);
        self::assertSame(TelegramLinkState::Ready, $link->fresh()->state);
        $this->travel(11)->minutes();
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasErrors('telegram');
        self::assertNull($web->fresh()->chat_id);
        Http::assertNothingSent();
    }

    /**
     * Новая ссылка отзывает старую; чужой browser session не завершает привязку.
     *
     * @return void
     */
    public function test_session_binding_new_challenge_and_owner_cancel(): void
    {
        $web = $this->web();
        [$oldToken, $old] = $this->start($web);
        [$token, $link] = $this->start($web);
        self::assertSame(TelegramLinkState::Cancelled, $old->fresh()->state);
        $this->identify($oldToken);
        self::assertNull($old->fresh()->telegram_chat_id);
        $this->identify($token);
        $this->consent($token);
        session()->migrate();
        $this->withCookie(config('session.cookie'), session()->getId());
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasErrors('telegram');
        $other = $this->web(['remnawave_user_id' => 303, 'profile_username' => 'other_nick']);
        session()->forget('password_hash_web');
        $this->actingAs($other, 'web')->withSession(['password_hash_web' => $other->password]);
        session()->save();
        $this->delete('/account/profile/telegram', ['link_id' => $link->id])->assertNotFound();
        $this->actingAs($web, 'web')->withSession(['password_hash_web' => $web->password]);
        session()->save();
        $this->delete('/account/profile/telegram', ['link_id' => $link->id])->assertSessionHasNoErrors();
        self::assertSame(TelegramLinkState::Cancelled, $link->fresh()->state);
        Http::assertNothingSent();
    }

    /**
     * Подписка не изменяется пока payment claim или ambiguous referral target не закрыт.
     *
     * @return void
     */
    public function test_in_flight_payment_prevents_taking_a_merge_snapshot(): void
    {
        $web = $this->web();
        Payment::factory()->create(['user_id' => $web->id, 'processing_token' => (string) Str::uuid(), 'processing_started_at' => now()]);
        [$token, $link] = $this->start($web);
        $this->identify($token);
        $this->consent($token);
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasErrors('telegram');
        self::assertSame(TelegramLinkState::Ready, $link->fresh()->state);
        self::assertNull($web->fresh()->telegram_merge_id);
        Http::assertNothingSent();
    }

    /**
     * Freeze запрещает параллельную mutation даже со stale User в памяти.
     *
     * @return void
     */
    public function test_subscription_lock_checks_fresh_merge_reservation(): void
    {
        $web = $this->web();
        $link = TelegramAccountLink::factory()->create(['user_id' => $web->id, 'bot_id' => $this->bot->id]);
        User::query()->whereKey($web->id)->update(['telegram_merge_id' => $link->id]);
        $this->expectException(\DomainException::class);
        app(SubscriptionMutationLock::class)->run($web, fn() => self::fail('Reserved subscription was mutated.'));
    }

    /**
     * Новая web/bot оплата не может появиться между snapshot и local merge commit.
     *
     * @return void
     */
    public function test_payment_creation_checks_merge_reservation_before_contacting_yookassa(): void
    {
        $web = $this->web();
        $link = TelegramAccountLink::factory()->create(['user_id' => $web->id, 'bot_id' => $this->bot->id]);
        User::query()->whereKey($web->id)->update(['telegram_merge_id' => $link->id]);
        $this->mock(\YooKassa\Client::class, fn($mock) => $mock->shouldNotReceive('createPayment'));
        $product = \App\Models\Product::factory()->create(['months' => 1]);
        $this->expectException(\App\Payment\Exceptions\PaymentCreationException::class);
        app(\App\Payment\PaymentService::class)->createPayment($web, $product);
    }

    /**
     * Штатный secret-path transport работает без optional secret_token header.
     *
     * @return void
     */
    public function test_existing_secret_path_webhook_remains_supported_without_optional_header(): void
    {
        config(['telegraph.webhook.secret_token' => null, 'services.telegram.link_bot_id' => '']);
        [$token, $link] = $this->start($this->web());
        $this->postJson('/telegraph/not-a-real-bot-token/webhook', $this->payload($token, 123_456))->assertNotFound();
        self::assertSame(TelegramLinkState::Pending, $link->fresh()->state);
        $this->postJson('/telegraph/' . $this->bot->token . '/webhook', $this->payload($token, 123_456))->assertNoContent();
        self::assertSame(TelegramLinkState::AwaitingTelegram, $link->fresh()->state);
    }

    /**
     * Case-insensitive PHP action dispatch не обходит проверку secret_token.
     *
     * @return void
     */
    public function test_uppercase_callback_action_cannot_bypass_webhook_header_validation(): void
    {
        [$token, $link] = $this->start($this->web());
        $this->identify($token);
        $payload = $this->payload($token, 123_456, true);
        $payload['callback_query']['data'] = 'action:LINKTELEGRAM;token:' . $token;
        $this->postJson('/telegraph/' . $this->bot->token . '/webhook', $payload)->assertForbidden();
        self::assertSame(TelegramLinkState::AwaitingTelegram, $link->fresh()->state);
    }

    /**
     * Незавершённая старая bot registration без remote subscription не блокирует linking.
     *
     * @return void
     */
    public function test_bot_account_without_remote_subscription_uses_existing_web_entitlement(): void
    {
        $telegram = $this->telegram(['remnawave_user_id' => null, 'created_at' => now()->subDays(20)]);
        $web = $this->web();
        $this->remote[101] = $this->remoteUser(101, null, $web->email, 10);
        [$token, $link] = $this->start($web);
        $this->identify($token);
        $this->consent($token);
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasNoErrors();
        self::assertSame(101, $web->fresh()->remnawave_user_id);
        self::assertSame(TelegramLinkState::Complete, $link->fresh()->state);
        $this->assertDatabaseMissing('users', ['id' => $telegram->id]);
    }

    /**
     * Pending invoice со скидкой должен завершиться до объединения discount histories.
     *
     * @return void
     */
    public function test_pending_invoice_without_processing_claim_also_prevents_merge(): void
    {
        $web = $this->web();
        Payment::factory()->create(['user_id' => $web->id, 'status' => PaymentStatus::Pending]);
        [$token, $link] = $this->start($web);
        $this->identify($token);
        $this->consent($token);
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasErrors('telegram');
        self::assertSame(TelegramLinkState::Ready, $link->fresh()->state);
        self::assertNull($web->fresh()->telegram_merge_id);
        Http::assertNothingSent();
    }

    /**
     * Отсутствие optional Telegram username не мешает привязке по подтверждённому ID.
     *
     * @return void
     */
    public function test_telegram_without_username_links_by_numeric_identity(): void
    {
        $web = $this->web();
        $this->remote[101] = $this->remoteUser(101, null, $web->email, 10);
        [$token, $link] = $this->start($web);
        $payload = $this->payload($token, 123_456);
        unset($payload['message']['from']['username']);
        $this->webhook($payload);
        $payload = $this->payload($token, 123_456, true);
        unset($payload['callback_query']['from']['username']);
        $this->webhook($payload);
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasNoErrors();
        self::assertSame(123_456, $web->fresh()->chat_id);
        self::assertNull($web->fresh()->username);
        self::assertSame(101, app(\App\Services\UserStateManager::class)->getRemoteUser($web->fresh())->id);
        Http::assertNotSent(fn(Request $request): bool => str_contains($request->url(), '/by-username/'));
    }

    /**
     * Ошибка numeric ownership в provider response не меняет и не удаляет подписки.
     *
     * @return void
     */
    public function test_remote_identity_mismatch_requires_reconciliation_without_mutations(): void
    {
        $web = $this->web();
        $this->remote[101] = $this->remoteUser(999, null, $web->email, 10);
        [$token, $link] = $this->start($web);
        $this->identify($token);
        $this->consent($token);
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasErrors('telegram');
        self::assertSame(TelegramLinkState::Applying, $link->fresh()->state);
        self::assertNull($link->fresh()->plan);
        self::assertNull($web->fresh()->chat_id);
        Http::assertNotSent(fn(Request $request): bool => $request->method() !== 'GET');
    }

    /**
     * Переносит допустимую attribution с newer account, если old account её не имел.
     *
     * @return void
     */
    public function test_merge_preserves_existing_third_party_referrer(): void
    {
        $referrer = User::factory()->create();
        $telegram = $this->telegram(['created_at' => now()->subDays(20)]);
        $web = $this->web(['referrer_user_id' => $referrer->id]);
        $this->remote[101] = $this->remoteUser(101, null, $web->email, 10);
        $this->remote[202] = $this->remoteUser(202, $telegram->chat_id, null, 20);
        [$token, $link] = $this->start($web);
        $this->identify($token);
        $this->consent($token);
        $this->post('/account/profile/telegram/confirm', ['link_id' => $link->id])->assertSessionHasNoErrors();
        self::assertSame($referrer->id, $telegram->fresh()->referrer_user_id);
    }

    /**
     * Создаёт подтверждённый web account с ready numeric mapping.
     *
     * @param array<string, mixed> $attributes
     *
     * @return User
     */
    private function web(array $attributes = []): User
    {
        return User::factory()->web()->verified()->create(array_replace([
            'remnawave_user_id' => 101, 'profile_username' => 'web_nickname',
            'created_at' => now()->subDays(5),
        ], $attributes));
    }

    /**
     * Создаёт независимый существующий bot account.
     *
     * @param array<string, mixed> $attributes
     *
     * @return User
     */
    private function telegram(array $attributes = []): User
    {
        return User::factory()->create(array_replace([
            'username' => 'telegram_user', 'chat_id' => 123_456, 'remnawave_user_id' => 202,
            'tags' => UserTags::Active, 'created_at' => now()->subDay(),
        ], $attributes));
    }

    /**
     * Запускает настоящий CSRF/Inertia route без перехода к внешнему Telegram.
     *
     * @param User $user
     *
     * @return array{string, TelegramAccountLink}
     */
    private function start(User $user): array
    {
        $response = $this->actingAs($user, 'web')->post('/account/profile/telegram', [], ['X-Inertia' => 'true'])->assertStatus(409);
        $this->withCookie(config('session.cookie'), session()->getId());
        parse_str(parse_url($response->headers->get('X-Inertia-Location'), PHP_URL_QUERY), $query);
        return [substr($query['start'], 5), TelegramAccountLink::query()->latest('id')->firstOrFail()];
    }

    /**
     * Открывает challenge в private bot chat.
     *
     * @param string $token
     * @param int $chatId
     *
     * @return void
     */
    private function identify(string $token, int $chatId = 123_456): void
    {
        $this->webhook($this->payload($token, $chatId));
    }

    /**
     * Нажимает bot consent callback от того же Telegram user.
     *
     * @param string $token
     * @param int $chatId
     *
     * @return void
     */
    private function consent(string $token, int $chatId = 123_456): void
    {
        $this->webhook($this->payload($token, $chatId, true));
    }

    /**
     * Отправляет Telegram payload с проверяемым secret transport.
     *
     * @param array<string, mixed> $payload
     *
     * @return void
     */
    private function webhook(array $payload): void
    {
        $this->postJson(
            '/telegraph/' . $this->bot->token . '/webhook',
            $payload,
            ['X-Telegram-Bot-Api-Secret-Token' => 'test-webhook-secret'],
        )->assertNoContent();
    }

    /**
     * Формирует настоящую Telegram update/callback структуру.
     *
     * @param string $token
     * @param int $chatId
     * @param bool $callback
     *
     * @return array<string, mixed>
     */
    private function payload(string $token, int $chatId, bool $callback = false): array
    {
        $sender = ['id' => $chatId, 'is_bot' => false, 'first_name' => 'Telegram', 'username' => 'telegram_user', 'is_premium' => true];
        $message = ['message_id' => 10, 'date' => now()->timestamp, 'chat' => ['id' => $chatId, 'type' => 'private']];
        return $callback ? ['update_id' => 22, 'callback_query' => [
            'id' => 88, 'from' => $sender, 'message' => $message, 'data' => 'action:linkTelegram;token:' . $token,
        ]] : ['update_id' => 21, 'message' => [...$message, 'from' => $sender, 'text' => '/start link_' . $token]];
    }

    /**
     * Stateful fake моделирует в том числе применённый, но не подтверждённый HTTP ответ.
     *
     * @param Request $request
     *
     * @return mixed
     */
    private function panel(Request $request): mixed
    {
        $path = parse_url($request->url(), PHP_URL_PATH);
        if ($request->method() === 'GET' && $path === '/api/users/stream') {
            $users = array_values(array_filter(
                $this->remote,
                fn(array $user): bool => (string) $user['telegramId'] === (string) $request['telegramId'],
            ));
            return Http::response(['response' => [
                'users' => array_slice($users, 0, 2), 'nextCursor' => null, 'hasMore' => count($users) > 2,
            ]]);
        }
        if (str_starts_with($path, '/api/hwid/devices/')) {
            return Http::response(['response' => ['devices' => [], 'total' => 0]]);
        }
        if ($request->method() === 'PATCH' && $path === '/api/users') {
            $data = $request->data();
            $id = $data['id'];
            $this->remote[$id] = array_replace($this->remote[$id], $data);
            if ($this->failPatch === $id) {
                $this->failPatch = null;
                return Http::response(['message' => 'ambiguous update'], 503);
            }
            return Http::response(['response' => $this->remote[$id]]);
        }
        if (preg_match('#/api/users/(\d+)$#', $path, $match) === 1) {
            $id = (int) $match[1];
            if (!isset($this->remote[$id])) {
                return Http::response(['message' => 'not found'], 404);
            }
            if ($request->method() === 'DELETE') {
                unset($this->remote[$id]);
                if ($this->failDelete === $id) {
                    $this->failDelete = null;
                    return Http::response(['message' => 'ambiguous delete'], 503);
                }
                return Http::response(null, 204);
            }
            return Http::response(['response' => $this->remote[$id]]);
        }
        if (str_contains($path, '/by-username/')) {
            $username = basename($path);
            foreach ($this->remote as $remote) {
                if ($remote['username'] === $username) {
                    return Http::response(['response' => $remote]);
                }
            }
            return Http::response(['message' => 'not found'], 404);
        }
        throw new \RuntimeException('Unexpected HTTP request: ' . $request->method() . ' ' . $path);
    }

    /**
     * Возвращает provider truth с различимыми credentials обоих remote users.
     *
     * @param int $id
     * @param int|null $chatId
     * @param string|null $email
     * @param int $days
     * @param string $tag
     *
     * @return array<string, mixed>
     */
    private function remoteUser(int $id, ?int $chatId, ?string $email, int $days, string $tag = 'ACTIVE'): array
    {
        return [
            'id' => $id, 'shortUuid' => 'short-' . $id, 'username' => $chatId === null ? 'web_provider' : 'telegram_user',
            'status' => 'ACTIVE', 'trafficLimitBytes' => 0, 'trafficLimitStrategy' => 'NO_RESET',
            'lastTriggeredThreshold' => 0,
            'expireAt' => now()->addDays($days)->utc()->toIso8601String(), 'telegramId' => $chatId,
            'email' => $email, 'tag' => $tag, 'hwidDeviceLimit' => 5,
            'trojanPassword' => 'trojan-' . $id, 'vlessUuid' => 'uuid-' . $id, 'ssPassword' => 'ss-' . $id,
            'createdAt' => now()->subDays(30)->toIso8601String(), 'updatedAt' => now()->toIso8601String(),
            'subscriptionUrl' => 'https://sub.test/' . $id, 'activeInternalSquads' => [],
            'userTraffic' => ['usedTrafficBytes' => 0, 'lifetimeUsedTrafficBytes' => 0, 'onlineAt' => null,
                'firstConnectedAt' => null, 'lastConnectedNodeUuid' => null],
        ];
    }
}
