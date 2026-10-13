<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Bot\Telegram\Enums\UserTags;
use App\Enums\ReferralRewardStatus;
use App\Models\Payment;
use App\Models\Promocode;
use App\Models\ReferralBonus;
use App\Models\ReferralReward;
use App\Models\TelegramBot;
use App\Models\User;
use App\Payment\Enums\PaymentSource;
use App\Payment\Enums\PaymentStatus;
use App\Payment\Exceptions\PaymentProcessingException;
use App\Payment\PaymentService;
use App\Services\PromocodeService;
use DefStudio\Telegraph\Facades\Telegraph;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Mockery;
use Tests\TestCase;
use YooKassa\Client;
use YooKassa\Request\Payments\PaymentResponse;

final class YooKassaWebhookProcessingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return void
     */
    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    /**
     * @return void
     */
    public function test_succeeded_payment_is_processed_once_with_all_side_effects(): void
    {
        Carbon::setTestNow('2026-10-04 12:00:00');
        config([
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'api-token',
        ]);

        $referrer = User::factory()->create();
        $user = User::factory()->create([
            'referrer_user_id' => $referrer->id,
            'tags' => UserTags::Inactive,
        ]);
        ReferralBonus::query()->create([
            'paid_months' => 3,
            'bonus_days' => 14,
        ]);
        $promocode = Promocode::factory()->create([
            'user_id' => $user->id,
            'count' => 1,
        ]);
        $payment = Payment::factory()->create([
            'user_id' => $user->id,
            'promocode_id' => $promocode->id,
            'source' => PaymentSource::Telegram,
            'months' => 3,
        ]);
        $this->bot($user, $referrer);
        $telegraph = Telegraph::fake();
        $this->mockYooKassa($payment, PaymentStatus::Succeeded, 2);
        $this->fakeRemnawave('2026-11-15T10:00:00.000Z');

        $service = app(PaymentService::class);
        $payload = $this->notification($payment, PaymentStatus::Succeeded);
        $service->handleNotification($payload);

        $telegraph->assertSent("✅ Оплата прошла успешно.\n\nПодписка продлена до *15.02.2027*.");
        $telegraph->assertSentData(\DefStudio\Telegraph\Telegraph::ENDPOINT_MESSAGE, [
            'chat_id' => $referrer->chat_id,
            'text' => "🎁 Ваш друг оплатил подписку.\n\n"
                . 'Вам начислено вознаграждение: *14 дней*.',
        ]);
        $telegraph->assertNotSentData(\DefStudio\Telegraph\Telegraph::ENDPOINT_MESSAGE, [
            'chat_id' => $user->chat_id,
            'text' => "🎁 Ваш друг оплатил подписку.\n\n"
                . 'Вам начислено вознаграждение: *14 дней*.',
        ]);

        $duplicateTelegraph = Telegraph::fake();
        $service->handleNotification($payload);
        $duplicateTelegraph->assertNothingSent();

        $payment->refresh();
        self::assertSame(PaymentStatus::Succeeded, $payment->status);
        self::assertSame('2027-02-15 10:00:00', $payment->subscription_expires_at?->utc()->format('Y-m-d H:i:s'));
        self::assertNotNull($payment->processed_at);
        self::assertNotNull($payment->notified_at);
        self::assertNull($payment->processing_token);
        self::assertSame(UserTags::Active, $user->refresh()->tags);
        $this->assertDatabaseCount('user_promocodes', 1);
        $this->assertDatabaseHas('user_promocodes', [
            'user_id' => $user->id,
            'promocode_id' => $promocode->id,
        ]);
        self::assertSame(0, $promocode->refresh()->count);
        self::assertNull(app(PromocodeService::class)->automaticForUser($user));
        $this->assertDatabaseCount('referral_rewards', 1);
        $this->assertDatabaseHas('referral_rewards', [
            'referred_user_id' => $user->id,
            'referrer_user_id' => $referrer->id,
            'payment_id' => $payment->id,
            'days_added' => 14,
            'status' => ReferralRewardStatus::Applied->value,
        ]);
        $referralReward = ReferralReward::query()->whereBelongsTo($payment)->firstOrFail();
        self::assertSame(
            '2026-11-29 10:00:00',
            $referralReward->target_expires_at?->format('Y-m-d H:i:s'),
        );
        self::assertNotNull($referralReward->notified_at);
        Http::assertSentCount(4);
        Http::assertSent(fn(Request $request): bool => $request->method() === 'PATCH'
            && $request->url() === 'https://panel.test/api/users'
            && $request->data()['expireAt'] === '2027-02-15T10:00:00.000Z'
            && $request->data()['tag'] === 'ACTIVE');
        Http::assertSent(fn(Request $request): bool => $request->method() === 'PATCH'
            && $request->url() === 'https://panel.test/api/users'
            && $request->data()['expireAt'] === '2026-11-29T10:00:00.000Z'
            && $request->data()['tag'] === 'ACTIVE');
    }

    /**
     * @return void
     */
    public function test_expired_subscription_is_extended_from_now(): void
    {
        Carbon::setTestNow('2026-10-04 12:00:00');
        config([
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'api-token',
        ]);
        $payment = Payment::factory()->create(['months' => 1]);
        $this->mockYooKassa($payment, PaymentStatus::Succeeded);
        $this->fakeRemnawave('2026-09-01T00:00:00.000Z');

        app(PaymentService::class)->handleNotification(
            $this->notification($payment, PaymentStatus::Succeeded),
        );

        self::assertSame(
            '2026-11-04 12:00:00',
            $payment->refresh()->subscription_expires_at?->utc()->format('Y-m-d H:i:s'),
        );
    }

    /**
     * @return void
     */
    public function test_canceled_payment_has_no_business_side_effects_and_sends_retry_button(): void
    {
        $referrer = User::factory()->create();
        $user = User::factory()->create(['referrer_user_id' => $referrer->id]);
        ReferralBonus::query()->create([
            'paid_months' => 1,
            'bonus_days' => 7,
        ]);
        $promocode = Promocode::factory()->create([
            'user_id' => $user->id,
            'count' => 1,
        ]);
        $payment = Payment::factory()->create([
            'user_id' => $user->id,
            'promocode_id' => $promocode->id,
            'source' => PaymentSource::Telegram,
        ]);
        $this->bot($user, $referrer);
        $telegraph = Telegraph::fake();
        $this->mockYooKassa($payment, PaymentStatus::Canceled, 2);
        Http::fake();

        $service = app(PaymentService::class);
        $payload = $this->notification($payment, PaymentStatus::Canceled);
        $service->handleNotification($payload);
        $service->handleNotification($payload);

        $payment->refresh();
        self::assertSame(PaymentStatus::Canceled, $payment->status);
        self::assertNull($payment->subscription_expires_at);
        $this->assertDatabaseCount('user_promocodes', 0);
        $this->assertDatabaseCount('referral_rewards', 0);
        $this->assertDatabaseCount('payments', 1);
        self::assertTrue($promocode->is(app(PromocodeService::class)->automaticForUser($user)));
        self::assertSame(1, $promocode->refresh()->count);
        Http::assertNothingSent();
        $telegraph->assertSent(
            '❌ Недостаточно средств. Пополните баланс или используйте другое платёжное средство.',
        );
        $telegraph->assertNotSent((string) $payment->confirmation_url);
        $telegraph->assertSentData(\DefStudio\Telegraph\Telegraph::ENDPOINT_MESSAGE, [
            'reply_markup' => [
                'inline_keyboard' => [[[
                    'text' => 'Попробовать снова',
                    'callback_data' => "action:buy;product:{$payment->product_id};promocode:{$promocode->id}",
                ]]],
            ],
        ]);
    }

    /**
     * @return void
     */
    public function test_second_successful_payment_adds_another_referral_reward(): void
    {
        Carbon::setTestNow('2026-10-04 12:00:00');
        config([
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'api-token',
        ]);
        $referrer = User::factory()->create();
        $user = User::factory()->create(['referrer_user_id' => $referrer->id]);
        ReferralBonus::query()->create([
            'paid_months' => 1,
            'bonus_days' => 7,
        ]);
        $firstPayment = Payment::factory()->create([
            'user_id' => $user->id,
            'status' => PaymentStatus::Succeeded,
        ]);
        ReferralReward::query()->create([
            'referrer_user_id' => $referrer->id,
            'referred_user_id' => $user->id,
            'payment_id' => $firstPayment->id,
            'days_added' => 7,
            'status' => ReferralRewardStatus::Legacy,
            'notified_at' => now(),
        ]);
        $payment = Payment::factory()->create([
            'user_id' => $user->id,
            'months' => 1,
        ]);
        $this->bot($user, $referrer);
        $telegraph = Telegraph::fake();
        $this->mockYooKassa($payment, PaymentStatus::Succeeded);
        $this->fakeRemnawave('2026-10-10T00:00:00.000Z');

        app(PaymentService::class)->handleNotification(
            $this->notification($payment, PaymentStatus::Succeeded),
        );

        self::assertSame(PaymentStatus::Succeeded, $payment->refresh()->status);
        $this->assertDatabaseCount('referral_rewards', 2);
        $this->assertDatabaseHas('referral_rewards', [
            'referrer_user_id' => $referrer->id,
            'referred_user_id' => $user->id,
            'payment_id' => $payment->id,
            'days_added' => 7,
            'status' => ReferralRewardStatus::Applied->value,
        ]);
        $referralReward = ReferralReward::query()->whereBelongsTo($payment)->firstOrFail();
        self::assertSame(
            '2026-10-17 00:00:00',
            $referralReward->target_expires_at?->format('Y-m-d H:i:s'),
        );
        $telegraph->assertSentData(\DefStudio\Telegraph\Telegraph::ENDPOINT_MESSAGE, [
            'chat_id' => $referrer->chat_id,
            'text' => "🎁 Ваш друг оплатил подписку.\n\n"
                . 'Вам начислено вознаграждение: *7 дней*.',
        ]);
    }

    /**
     * @return void
     */
    public function test_successful_retry_leaves_the_original_payment_canceled(): void
    {
        Carbon::setTestNow('2026-10-04 12:00:00');
        config([
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'api-token',
        ]);
        $user = User::factory()->create();
        $originalPayment = Payment::factory()->create([
            'user_id' => $user->id,
            'status' => PaymentStatus::Canceled,
        ]);
        $retryPayment = Payment::factory()->create([
            'user_id' => $user->id,
            'product_id' => $originalPayment->product_id,
            'months' => 1,
            'status' => PaymentStatus::Pending,
        ]);
        $this->mockYooKassa($retryPayment, PaymentStatus::Succeeded);
        $this->fakeRemnawave('2026-10-10T00:00:00.000Z');

        app(PaymentService::class)->handleNotification(
            $this->notification($retryPayment, PaymentStatus::Succeeded),
        );

        self::assertSame(PaymentStatus::Canceled, $originalPayment->refresh()->status);
        self::assertNull($originalPayment->subscription_expires_at);
        self::assertSame(PaymentStatus::Succeeded, $retryPayment->refresh()->status);
        self::assertSame(
            '2026-11-10',
            $retryPayment->subscription_expires_at?->format('Y-m-d'),
        );
    }

    /**
     * @return void
     */
    public function test_concurrent_processing_claim_prevents_duplicate_remote_sync(): void
    {
        Carbon::setTestNow('2026-10-04 12:00:00');
        $payment = Payment::factory()->create([
            'processing_token' => (string) Str::uuid(),
            'processing_started_at' => now(),
        ]);
        $this->mockYooKassa($payment, PaymentStatus::Succeeded);
        Http::fake();

        try {
            app(PaymentService::class)->handleNotification(
                $this->notification($payment, PaymentStatus::Succeeded),
            );
            self::fail('PaymentProcessingException was not thrown.');
        } catch (PaymentProcessingException) {
        }

        self::assertSame(PaymentStatus::Pending, $payment->refresh()->status);
        Http::assertNothingSent();
    }

    /**
     * @return void
     */
    public function test_unknown_payment_is_logged_without_creating_or_processing_payment(): void
    {
        $client = Mockery::mock(Client::class);
        $client->shouldNotReceive('getPaymentInfo');
        $this->app->instance(Client::class, $client);
        Http::fake();
        $payment = Payment::factory()->make();

        app(PaymentService::class)->handleNotification(
            $this->notification($payment, PaymentStatus::Succeeded),
        );

        $this->assertDatabaseCount('payments', 0);
        $this->assertDatabaseCount('referral_rewards', 0);
        Http::assertNothingSent();
    }

    /**
     * @return void
     */
    public function test_remnawave_error_keeps_payment_pending_and_preserves_retry_target(): void
    {
        Carbon::setTestNow('2026-10-04 12:00:00');
        config([
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'api-token',
        ]);
        $promocode = Promocode::factory()->create(['count' => 1]);
        $referrer = User::factory()->create();
        $user = User::factory()->create([
            'referrer_user_id' => $referrer->id,
            'tags' => UserTags::Inactive,
        ]);
        ReferralBonus::query()->create([
            'paid_months' => 1,
            'bonus_days' => 7,
        ]);
        $payment = Payment::factory()->create([
            'user_id' => $user->id,
            'promocode_id' => $promocode->id,
        ]);
        $this->mockYooKassa($payment, PaymentStatus::Succeeded);
        Log::spy();
        Http::fake([
            'panel.test/api/users/by-username/*' => Http::response([
                'response' => $this->remnawaveUser('2026-10-10T00:00:00.000Z'),
            ]),
            'panel.test/api/users' => Http::response(['message' => 'unavailable'], 503),
        ]);

        try {
            app(PaymentService::class)->handleNotification(
                $this->notification($payment, PaymentStatus::Succeeded),
            );
            self::fail('Remnawave exception was not thrown.');
        } catch (\Throwable) {
        }

        $payment->refresh();
        self::assertSame(PaymentStatus::Pending, $payment->status);
        self::assertSame('2026-11-10', $payment->subscription_expires_at?->format('Y-m-d'));
        self::assertNull($payment->processing_token);
        self::assertSame(UserTags::Inactive, $user->refresh()->tags);
        $this->assertDatabaseCount('user_promocodes', 0);
        $this->assertDatabaseCount('referral_rewards', 0);
        Log::shouldHaveReceived('error')
            ->once()
            ->with(
                'YooKassa payment post-processing failed.',
                Mockery::on(static fn(array $context): bool => $context['payment_id'] === $payment->id
                    && !str_contains(json_encode($context, JSON_THROW_ON_ERROR), 'api-token')),
            );
    }

    /**
     * @return void
     */
    public function test_referral_remnawave_failure_does_not_rollback_successful_payment(): void
    {
        Carbon::setTestNow('2026-10-04 12:00:00');
        config([
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'api-token',
        ]);
        $referrer = User::factory()->create(['username' => 'referrer_user']);
        $user = User::factory()->create([
            'username' => 'payer_user',
            'referrer_user_id' => $referrer->id,
        ]);
        ReferralBonus::query()->create([
            'paid_months' => 1,
            'bonus_days' => 7,
        ]);
        $payment = Payment::factory()->create([
            'user_id' => $user->id,
            'source' => PaymentSource::Telegram,
            'months' => 1,
        ]);
        $this->bot($user, $referrer);
        $telegraph = Telegraph::fake();
        $this->mockYooKassa($payment, PaymentStatus::Succeeded);
        Http::fake(function (Request $request) use ($referrer) {
            if (
                $request->method() === 'GET'
                && str_contains($request->url(), rawurlencode($referrer->username))
            ) {
                return Http::response([
                    'response' => $this->remnawaveUser('2026-10-20T00:00:00.000Z'),
                ]);
            }

            if (
                $request->method() === 'PATCH'
                && $request->data()['expireAt'] === '2026-10-27T00:00:00.000Z'
            ) {
                return Http::response(['message' => 'unavailable'], 503);
            }

            $expireAt = $request->method() === 'PATCH'
                ? $request->data()['expireAt']
                : '2026-10-10T00:00:00.000Z';

            return Http::response(['response' => $this->remnawaveUser($expireAt)]);
        });

        app(PaymentService::class)->handleNotification(
            $this->notification($payment, PaymentStatus::Succeeded),
        );

        $reward = ReferralReward::query()->whereBelongsTo($payment)->firstOrFail();
        self::assertSame(PaymentStatus::Succeeded, $payment->refresh()->status);
        self::assertSame(ReferralRewardStatus::Pending, $reward->status);
        self::assertSame('2026-10-27 00:00:00', $reward->target_expires_at?->format('Y-m-d H:i:s'));
        self::assertNotNull($reward->last_error);
        self::assertNull($reward->notified_at);
        $telegraph->assertSent("✅ Оплата прошла успешно.\n\nПодписка продлена до *10.11.2026*.");
        $telegraph->assertNotSentData(\DefStudio\Telegraph\Telegraph::ENDPOINT_MESSAGE, [
            'chat_id' => $referrer->chat_id,
            'text' => "🎁 Ваш друг оплатил подписку.\n\n"
                . 'Вам начислено вознаграждение: *7 дней*.',
        ]);
    }

    /**
     * @param Payment $payment
     * @param PaymentStatus $status
     * @param int $times
     * @return void
     */
    private function mockYooKassa(Payment $payment, PaymentStatus $status, int $times = 1): void
    {
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('getPaymentInfo')
            ->times($times)
            ->with($payment->yookassa_payment_id)
            ->andReturn($this->yookassaPayment($payment, $status));
        $this->app->instance(Client::class, $client);
    }

    /**
     * @param Payment $payment
     * @param PaymentStatus $status
     * @return string
     * @throws \JsonException
     */
    private function notification(Payment $payment, PaymentStatus $status): string
    {
        return json_encode([
            'type' => 'notification',
            'event' => "payment.{$status->value}",
            'object' => $this->yookassaData($payment, $status),
        ], JSON_THROW_ON_ERROR);
    }

    /**
     * @param Payment $payment
     * @param PaymentStatus $status
     * @return PaymentResponse
     */
    private function yookassaPayment(Payment $payment, PaymentStatus $status): PaymentResponse
    {
        return new PaymentResponse($this->yookassaData($payment, $status));
    }

    /**
     * @param Payment $payment
     * @param PaymentStatus $status
     * @return array<string, mixed>
     */
    private function yookassaData(Payment $payment, PaymentStatus $status): array
    {
        return [
            'id' => $payment->yookassa_payment_id,
            'status' => $status->value,
            'recipient' => ['account_id' => '123', 'gateway_id' => '456'],
            'amount' => ['value' => '200.00', 'currency' => 'RUB'],
            'created_at' => '2026-10-04T12:00:00.000Z',
            'captured_at' => $status === PaymentStatus::Succeeded
                ? '2026-10-04T12:01:00.000Z'
                : null,
            'paid' => $status === PaymentStatus::Succeeded,
            'refundable' => false,
            'test' => true,
            'metadata' => ['payment_id' => (string) $payment->id],
            'cancellation_details' => $status === PaymentStatus::Canceled
                ? ['party' => 'payment_network', 'reason' => 'insufficient_funds']
                : null,
        ];
    }

    /**
     * @param string $expireAt
     * @return void
     */
    private function fakeRemnawave(string $expireAt): void
    {
        Http::fake(function (Request $request) use ($expireAt) {
            $responseExpireAt = $request->method() === 'PATCH'
                ? $request->data()['expireAt']
                : $expireAt;

            return Http::response(['response' => $this->remnawaveUser($responseExpireAt)]);
        });
    }

    /**
     * @param string $expireAt
     * @return array<string, mixed>
     */
    private function remnawaveUser(string $expireAt): array
    {
        return [
            'id' => 42,
            'shortUuid' => 'short',
            'username' => 'test_user',
            'status' => 'ACTIVE',
            'trafficLimitBytes' => 1000,
            'trafficLimitStrategy' => 'NO_RESET',
            'expireAt' => $expireAt,
            'trojanPassword' => 'password',
            'vlessUuid' => '00000000-0000-4000-8000-000000000002',
            'ssPassword' => 'password',
            'lastTriggeredThreshold' => 0,
            'createdAt' => '2026-10-01T00:00:00.000Z',
            'updatedAt' => '2026-10-01T00:00:00.000Z',
            'subscriptionUrl' => 'https://example.test/sub',
            'activeInternalSquads' => [],
            'userTraffic' => [
                'usedTrafficBytes' => 0,
                'lifetimeUsedTrafficBytes' => 0,
                'onlineAt' => null,
                'firstConnectedAt' => null,
                'lastConnectedNodeUuid' => null,
            ],
        ];
    }

    /**
     * @param User $user
     * @param User|null $additionalUser
     * @return TelegramBot
     */
    private function bot(User $user, ?User $additionalUser = null): TelegramBot
    {
        $bot = TelegramBot::query()->create([
            'token' => 'test-bot-token',
            'name' => 'Test bot',
        ]);
        $bot->chats()->create([
            'chat_id' => $user->chat_id,
            'name' => 'Test chat',
        ]);

        if ($additionalUser !== null) {
            $bot->chats()->create([
                'chat_id' => $additionalUser->chat_id,
                'name' => 'Additional test chat',
            ]);
        }

        return $bot;
    }
}
