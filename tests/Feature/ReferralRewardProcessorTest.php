<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\ReferralRewardStatus;
use App\Models\Payment;
use App\Models\ReferralReward;
use App\Models\TelegramBot;
use App\Models\User;
use App\Payment\Enums\PaymentStatus;
use App\Remnawave\Exceptions\ApiException;
use App\Services\ReferralRewardProcessor;
use DefStudio\Telegraph\Facades\Telegraph;
use DefStudio\Telegraph\Support\Testing\Fakes\TelegraphFake;
use Illuminate\Console\Scheduling\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schedule;
use Tests\TestCase;

final class ReferralRewardProcessorTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();

        Carbon::setTestNow('2026-10-04T12:00:00Z');
        config([
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'api-token',
        ]);
        Http::preventStrayRequests();
    }

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
     * @throws \Throwable
     */
    public function test_pending_reward_extends_remote_expiration_and_notifies_referrer(): void
    {
        [$reward, $referrer] = $this->pendingReward();
        $telegraph = $this->bot($referrer);
        $this->fakeRemnawave('2026-10-10T00:00:00.000Z');

        $result = app(ReferralRewardProcessor::class)->process($reward);

        $reward->refresh();
        self::assertTrue($result['applied']);
        self::assertTrue($result['notified']);
        self::assertSame(ReferralRewardStatus::Applied, $reward->status);
        self::assertSame('2026-10-10 00:00:00', $reward->remote_expires_at_before?->format('Y-m-d H:i:s'));
        self::assertSame('2026-10-17 00:00:00', $reward->target_expires_at?->format('Y-m-d H:i:s'));
        self::assertNotNull($reward->applied_at);
        self::assertNotNull($reward->notified_at);
        self::assertSame(1, $reward->attempts);
        Http::assertSent(fn(Request $request): bool => $request->method() === 'PATCH'
            && $request->url() === 'https://panel.test/api/users'
            && $request->data()['expireAt'] === '2026-10-17T00:00:00.000Z');
        $telegraph->assertSentData(\DefStudio\Telegraph\Telegraph::ENDPOINT_MESSAGE, [
            'chat_id' => $referrer->chat_id,
            'text' => "🎁 Ваш друг оплатил подписку.\n\n"
                . 'Вам начислено вознаграждение: *7 дней*.',
        ]);
    }

    /**
     * @return void
     * @throws \Throwable
     */
    public function test_expired_reward_uses_now_and_reactivates_remote_user(): void
    {
        [$reward, $referrer] = $this->pendingReward();
        $this->bot($referrer);
        $this->fakeRemnawave('2026-10-01T00:00:00.000Z', 'EXPIRED');

        app(ReferralRewardProcessor::class)->process($reward);

        self::assertSame(
            '2026-10-11 12:00:00',
            $reward->refresh()->target_expires_at?->format('Y-m-d H:i:s'),
        );
        Http::assertSent(fn(Request $request): bool => $request->method() === 'PATCH'
            && $request->data()['status'] === 'ACTIVE'
            && $request->data()['expireAt'] === '2026-10-11T12:00:00.000Z');
    }

    /**
     * @return void
     * @throws \Throwable
     */
    public function test_failed_remote_update_preserves_absolute_target_for_retry(): void
    {
        [$reward, $referrer] = $this->pendingReward();
        $this->bot($referrer);
        $patchAttempts = 0;
        Http::fake(function (Request $request) use (&$patchAttempts) {
            if ($request->method() === 'PATCH' && $patchAttempts++ === 0) {
                return Http::response(['message' => 'unavailable'], 503);
            }

            $expireAt = $request->method() === 'PATCH'
                ? $request->data()['expireAt']
                : '2026-10-10T00:00:00.000Z';

            return Http::response([
                'response' => $this->remoteUser($expireAt),
            ]);
        });

        try {
            app(ReferralRewardProcessor::class)->process($reward);
            self::fail('Remnawave exception was not thrown.');
        } catch (ApiException) {
        }

        $reward->refresh();
        self::assertSame(ReferralRewardStatus::Pending, $reward->status);
        self::assertSame('2026-10-17 00:00:00', $reward->target_expires_at?->format('Y-m-d H:i:s'));
        self::assertSame(1, $reward->attempts);
        self::assertNotNull($reward->last_error);

        app(ReferralRewardProcessor::class)->process($reward);

        $reward->refresh();
        self::assertSame(ReferralRewardStatus::Applied, $reward->status);
        self::assertSame('2026-10-17 00:00:00', $reward->target_expires_at?->format('Y-m-d H:i:s'));
        self::assertSame(2, $reward->attempts);
    }

    /**
     * @return void
     * @throws \Throwable
     */
    public function test_changed_remote_expiration_is_marked_as_conflict_without_overwrite(): void
    {
        [$reward, $referrer] = $this->pendingReward([
            'remote_expires_at_before' => '2026-10-10 00:00:00',
            'target_expires_at' => '2026-10-17 00:00:00',
        ]);
        $telegraph = $this->bot($referrer);
        Http::fake([
            'panel.test/api/users/by-username/*' => Http::response([
                'response' => $this->remoteUser('2026-10-15T00:00:00.000Z'),
            ]),
        ]);

        $result = app(ReferralRewardProcessor::class)->process($reward);

        $reward->refresh();
        self::assertTrue($result['conflicted']);
        self::assertSame(ReferralRewardStatus::Conflict, $reward->status);
        self::assertNull($reward->applied_at);
        self::assertNull($reward->notified_at);
        self::assertStringContainsString('Remote expiration conflict', (string) $reward->last_error);
        Http::assertNotSent(fn(Request $request): bool => $request->method() === 'PATCH');
        $telegraph->assertNothingSent();
    }

    /**
     * @return void
     */
    public function test_processing_command_is_scheduled_every_five_minutes_without_overlapping(): void
    {
        $event = collect(Schedule::events())->first(
            static fn(Event $event): bool => str_contains(
                $event->command,
                'referrals:process-rewards',
            ),
        );

        self::assertNotNull($event);
        self::assertSame('*/5 * * * *', $event->expression);
        self::assertTrue($event->withoutOverlapping);
    }

    /**
     * @return void
     */
    public function test_due_processing_retries_notification_without_remote_request(): void
    {
        [$reward, $referrer] = $this->pendingReward([
            'status' => ReferralRewardStatus::Applied,
            'remote_expires_at_before' => '2026-10-10 00:00:00',
            'target_expires_at' => '2026-10-17 00:00:00',
            'applied_at' => now(),
        ]);
        $telegraph = $this->bot($referrer);
        Http::fake();

        $result = app(ReferralRewardProcessor::class)->processDue();

        self::assertSame(1, $result['processed']);
        self::assertSame(0, $result['applied']);
        self::assertSame(1, $result['notified']);
        self::assertNotNull($reward->refresh()->notified_at);
        Http::assertNothingSent();
        $telegraph->assertSentData(\DefStudio\Telegraph\Telegraph::ENDPOINT_MESSAGE, [
            'chat_id' => $referrer->chat_id,
            'text' => "🎁 Ваш друг оплатил подписку.\n\n"
                . 'Вам начислено вознаграждение: *7 дней*.',
        ]);
    }

    /**
     * @param array<string, mixed> $attributes
     * @return array{ReferralReward, User}
     */
    private function pendingReward(array $attributes = []): array
    {
        $referrer = User::factory()->create(['username' => 'referrer']);
        $referredUser = User::factory()->create(['referrer_user_id' => $referrer->id]);
        $payment = Payment::factory()->create([
            'user_id' => $referredUser->id,
            'status' => PaymentStatus::Succeeded,
        ]);
        $reward = ReferralReward::query()->create([
            'referrer_user_id' => $referrer->id,
            'referred_user_id' => $referredUser->id,
            'payment_id' => $payment->id,
            'days_added' => 7,
            'status' => ReferralRewardStatus::Pending,
            ...$attributes,
        ]);

        return [$reward, $referrer];
    }

    /**
     * @param User $user
     * @return TelegraphFake
     */
    private function bot(User $user): TelegraphFake
    {
        $bot = TelegramBot::query()->create([
            'token' => 'test-bot-token',
            'name' => 'Test bot',
        ]);
        $bot->chats()->create([
            'chat_id' => $user->chat_id,
            'name' => 'Test chat',
        ]);

        return Telegraph::fake();
    }

    /**
     * @param string $expireAt
     * @param string $status
     * @return void
     */
    private function fakeRemnawave(string $expireAt, string $status = 'ACTIVE'): void
    {
        Http::fake(function (Request $request) use ($expireAt, $status) {
            $responseExpireAt = $request->method() === 'PATCH'
                ? $request->data()['expireAt']
                : $expireAt;

            return Http::response([
                'response' => $this->remoteUser($responseExpireAt, $status),
            ]);
        });
    }

    /**
     * @param string $expireAt
     * @param string $status
     * @return array<string, mixed>
     */
    private function remoteUser(string $expireAt, string $status = 'ACTIVE'): array
    {
        return [
            'id' => 42,
            'shortUuid' => 'short',
            'username' => 'referrer',
            'status' => $status,
            'trafficLimitBytes' => 1000,
            'trafficLimitStrategy' => 'NO_RESET',
            'expireAt' => $expireAt,
            'telegramId' => null,
            'email' => null,
            'description' => null,
            'tag' => 'ACTIVE',
            'hwidDeviceLimit' => null,
            'externalSquadUuid' => null,
            'trojanPassword' => 'password',
            'vlessUuid' => '00000000-0000-4000-8000-000000000002',
            'ssPassword' => 'password',
            'lastTriggeredThreshold' => 0,
            'subRevokedAt' => null,
            'lastTrafficResetAt' => null,
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
}
