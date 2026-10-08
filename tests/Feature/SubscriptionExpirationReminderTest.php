<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\TelegramBot;
use App\Models\User;
use App\Remnawave\Enums\UserStatus;
use DefStudio\Telegraph\Facades\Telegraph;
use DefStudio\Telegraph\Support\Testing\Fakes\TelegraphFake;
use Illuminate\Console\Scheduling\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schedule;
use Tests\TestCase;

final class SubscriptionExpirationReminderTest extends TestCase
{
    use RefreshDatabase;

    private const MESSAGE = "⏳ Ваша подписка скоро закончится.\n\nНе забудьте продлить её.";

    /**
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();

        Carbon::setTestNow('2026-10-07T12:00:00Z');
        config([
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'api-token',
        ]);
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
     */
    public function test_subscription_expiring_after_more_than_one_day_is_not_notified(): void
    {
        $user = User::factory()->create();
        $this->bot($user);
        $telegraph = Telegraph::fake();
        $this->fakeStream([
            $this->remoteUser($user, '2026-10-08T12:00:01.000Z'),
        ]);

        $this->artisan('subscriptions:notify-expiring')
            ->expectsOutput('Subscription reminders sent: 0.')
            ->assertSuccessful();

        $telegraph->assertNothingSent();
        self::assertNull($user->refresh()->subscription_reminder_sent_for);
    }

    /**
     * @return void
     */
    public function test_subscription_expiring_within_one_day_is_notified(): void
    {
        $user = User::factory()->create();
        $this->bot($user);
        $telegraph = Telegraph::fake();
        $this->fakeStream([
            $this->remoteUser($user, '2026-10-08T12:00:00.789Z'),
        ]);

        $this->artisan('subscriptions:notify-expiring')
            ->expectsOutput('Subscription reminders sent: 1.')
            ->assertSuccessful();

        $this->assertReminderSent($telegraph, $user);
        self::assertSame(
            '2026-10-08 12:00:00',
            $user->refresh()->subscription_reminder_sent_for?->utc()->format('Y-m-d H:i:s'),
        );
    }

    /**
     * @return void
     */
    public function test_repeated_command_does_not_duplicate_reminder(): void
    {
        $user = User::factory()->create();
        $this->bot($user);
        $this->fakeStream([
            $this->remoteUser($user, '2026-10-08T12:00:00.789Z'),
        ]);
        $telegraph = Telegraph::fake();

        $this->artisan('subscriptions:notify-expiring')->assertSuccessful();
        $this->assertReminderSent($telegraph, $user);

        $duplicateTelegraph = Telegraph::fake();
        $this->artisan('subscriptions:notify-expiring')
            ->expectsOutput('Subscription reminders sent: 0.')
            ->assertSuccessful();

        $duplicateTelegraph->assertNothingSent();
    }

    /**
     * @return void
     */
    public function test_renewed_expiration_can_receive_a_new_reminder(): void
    {
        $user = User::factory()->create();
        $this->bot($user);
        Http::fake([
            'panel.test/api/users/stream*' => Http::sequence()
                ->push($this->streamResponse([
                    $this->remoteUser($user, '2026-10-08T12:00:00.000Z'),
                ]))
                ->push($this->streamResponse([
                    $this->remoteUser($user, '2026-11-08T12:00:00.000Z'),
                ])),
        ]);
        $firstTelegraph = Telegraph::fake();

        $this->artisan('subscriptions:notify-expiring')->assertSuccessful();
        $this->assertReminderSent($firstTelegraph, $user);

        Carbon::setTestNow('2026-11-07T12:00:00Z');
        $renewedTelegraph = Telegraph::fake();

        $this->artisan('subscriptions:notify-expiring')
            ->expectsOutput('Subscription reminders sent: 1.')
            ->assertSuccessful();

        $this->assertReminderSent($renewedTelegraph, $user);
        self::assertSame(
            '2026-11-08 12:00:00',
            $user->refresh()->subscription_reminder_sent_for?->utc()->format('Y-m-d H:i:s'),
        );
    }

    /**
     * @return void
     */
    public function test_indefinite_family_and_friends_users_are_not_notified(): void
    {
        $family = User::factory()->create(['tags' => UserTags::Family]);
        $friends = User::factory()->create(['tags' => UserTags::Friends]);
        $this->bot($family, $friends);
        $telegraph = Telegraph::fake();
        $this->fakeStream([
            $this->remoteUser($family, '2099-01-01T00:00:00.000Z', tag: 'FAMILY'),
            $this->remoteUser($friends, '2099-01-01T00:00:00.000Z', tag: 'FRIENDS'),
        ]);

        $this->artisan('subscriptions:notify-expiring')
            ->expectsOutput('Subscription reminders sent: 0.')
            ->assertSuccessful();

        $telegraph->assertNothingSent();
        self::assertNull($family->refresh()->subscription_reminder_sent_for);
        self::assertNull($friends->refresh()->subscription_reminder_sent_for);
    }

    /**
     * @return void
     */
    public function test_limited_and_disabled_users_are_notified_but_expired_user_is_not(): void
    {
        $active = User::factory()->create();
        $limited = User::factory()->create();
        $disabled = User::factory()->create();
        $expired = User::factory()->create();
        $this->bot($active, $limited, $disabled, $expired);
        $telegraph = Telegraph::fake();
        $this->fakeStream([
            $this->remoteUser($active, '2026-10-08T00:00:00.000Z'),
            $this->remoteUser($limited, '2026-10-08T00:00:00.000Z', UserStatus::Limited),
            $this->remoteUser($disabled, '2026-10-08T00:00:00.000Z', UserStatus::Disabled),
            $this->remoteUser($expired, '2026-10-08T00:00:00.000Z', UserStatus::Expired),
        ]);

        $this->artisan('subscriptions:notify-expiring')
            ->expectsOutput('Subscription reminders sent: 3.')
            ->assertSuccessful();

        $this->assertReminderSent($telegraph, $active);
        $this->assertReminderSent($telegraph, $limited);
        $this->assertReminderSent($telegraph, $disabled);
        $telegraph->assertNotSentData(\DefStudio\Telegraph\Telegraph::ENDPOINT_MESSAGE, [
            'chat_id' => $expired->chat_id,
            'text' => self::MESSAGE,
        ]);
        self::assertNull($expired->refresh()->subscription_reminder_sent_for);
    }

    /**
     * @return void
     */
    public function test_cursor_pagination_and_username_fallback_are_supported(): void
    {
        $user = User::factory()->create();
        $this->bot($user);
        $telegraph = Telegraph::fake();
        Http::fake([
            'panel.test/api/users/stream*' => Http::sequence()
                ->push($this->streamResponse([], '42', true))
                ->push($this->streamResponse([
                    $this->remoteUser(
                        $user,
                        '2026-10-08T00:00:00.000Z',
                        includeTelegramId: false,
                    ),
                ])),
        ]);

        $this->artisan('subscriptions:notify-expiring')
            ->expectsOutput('Subscription reminders sent: 1.')
            ->assertSuccessful();

        $this->assertReminderSent($telegraph, $user);
        Http::assertSentCount(2);
        Http::assertSent(static fn(Request $request): bool => str_contains(
            $request->url(),
            'cursor=42',
        ));
    }

    /**
     * @return void
     */
    public function test_command_is_scheduled_hourly_without_overlapping(): void
    {
        $event = collect(Schedule::events())->first(
            static fn(Event $event): bool => str_contains(
                $event->command,
                'subscriptions:notify-expiring',
            ),
        );

        self::assertNotNull($event);
        self::assertSame('0 * * * *', $event->expression);
        self::assertTrue($event->withoutOverlapping);
    }

    /**
     * @param list<array<string, mixed>> $users
     * @return void
     */
    private function fakeStream(array $users): void
    {
        Http::fake([
            'panel.test/api/users/stream*' => Http::response($this->streamResponse($users)),
        ]);
    }

    /**
     * @param list<array<string, mixed>> $users
     * @param string|null $nextCursor
     * @param bool $hasMore
     * @return array<string, mixed>
     */
    private function streamResponse(
        array $users,
        ?string $nextCursor = null,
        bool $hasMore = false,
    ): array {
        return [
            'response' => [
                'users' => $users,
                'nextCursor' => $nextCursor,
                'hasMore' => $hasMore,
            ],
        ];
    }

    /**
     * @param User $user
     * @param string $expireAt
     * @param UserStatus $status
     * @param string|null $tag
     * @param bool $includeTelegramId
     * @return array<string, mixed>
     */
    private function remoteUser(
        User $user,
        string $expireAt,
        UserStatus $status = UserStatus::Active,
        ?string $tag = null,
        bool $includeTelegramId = true,
    ): array {
        return [
            'id' => $user->id + 1000,
            'shortUuid' => 'short-' . $user->id,
            'username' => $user->username,
            'status' => $status->value,
            'trafficLimitBytes' => 1000,
            'trafficLimitStrategy' => 'NO_RESET',
            'expireAt' => $expireAt,
            'telegramId' => $includeTelegramId ? $user->chat_id : null,
            'email' => null,
            'description' => null,
            'tag' => $tag,
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

    /**
     * @param User ...$users
     * @return TelegramBot
     */
    private function bot(User ...$users): TelegramBot
    {
        $bot = TelegramBot::query()->create([
            'token' => 'test-bot-token',
            'name' => 'Test bot',
        ]);

        foreach ($users as $user) {
            $bot->chats()->create([
                'chat_id' => $user->chat_id,
                'name' => 'Test chat',
            ]);
        }

        return $bot;
    }

    /**
     * @param TelegraphFake $telegraph
     * @param User $user
     * @return void
     */
    private function assertReminderSent(TelegraphFake $telegraph, User $user): void
    {
        $telegraph->assertSentData(\DefStudio\Telegraph\Telegraph::ENDPOINT_MESSAGE, [
            'chat_id' => $user->chat_id,
            'text' => self::MESSAGE,
            'reply_markup' => [
                'inline_keyboard' => [[[
                    'text' => 'Тарифы',
                    'callback_data' => 'action:plans',
                ]]],
            ],
        ]);
    }
}
