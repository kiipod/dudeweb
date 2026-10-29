<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Product;
use App\Models\TelegramBot;
use App\Models\User;
use App\Payment\Enums\PaymentStatus;
use App\Remnawave\Enums\UserStatus;
use DefStudio\Telegraph\Facades\Telegraph;
use DefStudio\Telegraph\Support\Testing\Fakes\TelegraphFake;
use DefStudio\Telegraph\Telegraph as TelegraphClient;
use Illuminate\Console\Scheduling\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schedule;
use Tests\TestCase;

final class DeviceLimitEnforcementTest extends TestCase
{
    use RefreshDatabase;

    private const MESSAGE = "⚠️ Превышен лимит устройств.\n\n"
        . "Подключено: *6*. Разрешено тарифом: *5*.\n\n"
        . 'Удалите лишние устройства, чтобы восстановить доступ.';

    /**
     * Готовит изолированное окружение перед каждым тестом.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'api-token',
        ]);
    }

    /**
     * Verify that counts below and equal to plan limit do nothing.
     *
     * @return void
     */
    public function test_counts_below_and_equal_to_plan_limit_do_nothing(): void
    {
        [$below] = $this->subscribedUser(5);
        [$equal] = $this->subscribedUser(5);
        $telegraph = Telegraph::fake();

        Http::fake([
            'panel.test/api/users/stream*' => Http::response($this->streamResponse([
                $this->remoteUser($below),
                $this->remoteUser($equal),
            ])),
            'panel.test/api/hwid/devices/' . ($below->id + 1000) => Http::response(
                $this->devicesResponse(4),
            ),
            'panel.test/api/hwid/devices/' . ($equal->id + 1000) => Http::response(
                $this->devicesResponse(5),
            ),
        ]);

        $this->artisan('subscriptions:enforce-device-limits')
            ->expectsOutput('Device limits checked: 2.')
            ->expectsOutput('Subscriptions disabled: 0.')
            ->assertSuccessful();

        Http::assertNotSent(static fn(Request $request): bool => str_contains(
            $request->url(),
            '/actions/disable',
        ));
        $telegraph->assertNothingSent();
        self::assertNull($below->refresh()->device_limit_exceeded_at);
        self::assertNull($equal->refresh()->device_limit_exceeded_at);
    }

    /**
     * Verify that count above current plan limit disables and notifies with management button.
     *
     * @return void
     */
    public function test_count_above_current_plan_limit_disables_and_notifies_with_management_button(): void
    {
        [$user] = $this->subscribedUser(5);
        $this->bot($user);
        $telegraph = Telegraph::fake();
        $remoteId = $user->id + 1000;

        Http::fake([
            'panel.test/api/users/stream*' => Http::response($this->streamResponse([
                $this->remoteUser($user),
            ])),
            "panel.test/api/hwid/devices/{$remoteId}" => Http::response(
                $this->devicesResponse(6),
            ),
            "panel.test/api/users/{$remoteId}/actions/disable" => Http::response([
                'response' => $this->remoteUser($user, UserStatus::Disabled),
            ]),
        ]);

        $this->artisan('subscriptions:enforce-device-limits')
            ->expectsOutput('Device limits checked: 1.')
            ->expectsOutput('Subscriptions disabled: 1.')
            ->expectsOutput('Device limit notifications sent: 1.')
            ->assertSuccessful();

        Http::assertSent(static fn(Request $request): bool => $request->method() === 'POST'
            && $request->url() === "https://panel.test/api/users/{$remoteId}/actions/disable"
            && $request->body() === '');
        $this->assertNotificationSent($telegraph, $user);

        $user->refresh();
        self::assertNotNull($user->device_limit_exceeded_at);
        self::assertNotNull($user->device_limit_notification_sent_at);
        self::assertSame(UserTags::Active, $user->tags);
    }

    /**
     * Verify that repeated check does not disable or notify twice.
     *
     * @return void
     */
    public function test_repeated_check_does_not_disable_or_notify_twice(): void
    {
        [$user] = $this->subscribedUser(5);
        $this->bot($user);
        $remoteId = $user->id + 1000;
        Http::fake([
            'panel.test/api/users/stream*' => Http::sequence()
                ->push($this->streamResponse([$this->remoteUser($user)]))
                ->push($this->streamResponse([
                    $this->remoteUser($user, UserStatus::Disabled),
                ])),
            "panel.test/api/hwid/devices/{$remoteId}" => Http::response(
                $this->devicesResponse(6),
            ),
            "panel.test/api/users/{$remoteId}/actions/disable" => Http::response([
                'response' => $this->remoteUser($user, UserStatus::Disabled),
            ]),
        ]);
        $firstTelegraph = Telegraph::fake();

        $this->artisan('subscriptions:enforce-device-limits')->assertSuccessful();
        $this->assertNotificationSent($firstTelegraph, $user);

        $secondTelegraph = Telegraph::fake();
        $this->artisan('subscriptions:enforce-device-limits')
            ->expectsOutput('Subscriptions disabled: 0.')
            ->expectsOutput('Device limit notifications sent: 0.')
            ->assertSuccessful();

        $secondTelegraph->assertNothingSent();
        self::assertCount(1, Http::recorded(
            static fn(Request $request): bool => str_contains(
                $request->url(),
                '/actions/disable',
            ),
        ));
    }

    /**
     * Verify that existing manual disabled status is not claimed or recovered.
     *
     * @return void
     */
    public function test_existing_manual_disabled_status_is_not_claimed_or_recovered(): void
    {
        [$user] = $this->subscribedUser(5);
        $telegraph = Telegraph::fake();

        Http::fake([
            'panel.test/api/users/stream*' => Http::response($this->streamResponse([
                $this->remoteUser($user, UserStatus::Disabled),
            ])),
        ]);

        $this->artisan('subscriptions:enforce-device-limits')
            ->expectsOutput('Device limits checked: 0.')
            ->assertSuccessful();

        Http::assertSentCount(1);
        $telegraph->assertNothingSent();
        self::assertNull($user->refresh()->device_limit_exceeded_at);
    }

    /**
     * Verify that latest successful payment defines current plan limit.
     *
     * @return void
     */
    public function test_latest_successful_payment_defines_current_plan_limit(): void
    {
        [$user] = $this->subscribedUser(3);
        $currentPlan = Plan::factory()->create(['device_limit' => 5]);
        $currentProduct = Product::factory()->create(['plan_id' => $currentPlan->id]);
        Payment::factory()->create([
            'user_id' => $user->id,
            'product_id' => $currentProduct->id,
            'status' => PaymentStatus::Succeeded,
            'processed_at' => now(),
        ]);
        $pendingPlan = Plan::factory()->create(['device_limit' => 1]);
        $pendingProduct = Product::factory()->create(['plan_id' => $pendingPlan->id]);
        Payment::factory()->create([
            'user_id' => $user->id,
            'product_id' => $pendingProduct->id,
            'status' => PaymentStatus::Pending,
        ]);
        $remoteId = $user->id + 1000;
        Http::fake([
            'panel.test/api/users/stream*' => Http::response($this->streamResponse([
                $this->remoteUser($user),
            ])),
            "panel.test/api/hwid/devices/{$remoteId}" => Http::response(
                $this->devicesResponse(5),
            ),
        ]);

        $this->artisan('subscriptions:enforce-device-limits')
            ->expectsOutput('Device limits checked: 1.')
            ->expectsOutput('Subscriptions disabled: 0.')
            ->assertSuccessful();

        Http::assertNotSent(static fn(Request $request): bool => str_contains(
            $request->url(),
            '/actions/disable',
        ));
    }

    /**
     * Verify that management button callback uses existing devices handler.
     *
     * @return void
     */
    public function test_management_button_callback_uses_existing_devices_handler(): void
    {
        [$user] = $this->subscribedUser(5);
        $bot = $this->bot($user);
        $telegraph = Telegraph::fake();
        $remoteId = $user->id + 1000;
        Http::fake([
            'panel.test/api/users/by-username/*' => Http::response([
                'response' => $this->remoteUser($user),
            ]),
            "panel.test/api/hwid/devices/{$remoteId}" => Http::response([
                'response' => [
                    'total' => 1,
                    'devices' => [$this->device($remoteId)],
                ],
            ]),
        ]);

        $this->postJson(
            "/telegraph/{$bot->token}/webhook",
            $this->callbackPayload($user->chat_id, 'action:devices'),
        )->assertNoContent();

        $telegraph->assertSent('*Ваши устройства:*', false);
        $telegraph->assertSentData(TelegraphClient::ENDPOINT_MESSAGE, [
            'reply_markup' => [
                'inline_keyboard' => [[[
                    'text' => '❌ Android | Pixel',
                    'callback_data' => 'action:deleteDevice;hwid:device-1',
                ]]],
            ],
        ]);
    }

    /**
     * Verify that delete device callback recovers our disabled subscription at limit.
     *
     * @return void
     */
    public function test_delete_device_callback_recovers_our_disabled_subscription_at_limit(): void
    {
        [$user] = $this->subscribedUser(5);
        $user->update([
            'device_limit_exceeded_at' => now(),
            'device_limit_notification_sent_at' => now(),
        ]);
        $bot = $this->bot($user);
        $telegraph = Telegraph::fake();
        $remoteId = $user->id + 1000;

        Http::fake([
            'panel.test/api/users/by-username/*' => Http::response([
                'response' => $this->remoteUser($user, UserStatus::Disabled),
            ]),
            'panel.test/api/hwid/devices/delete' => Http::response(
                $this->devicesResponse(5),
            ),
            "panel.test/api/users/{$remoteId}/actions/enable" => Http::response([
                'response' => $this->remoteUser($user),
            ]),
            "panel.test/api/hwid/devices/{$remoteId}" => Http::response(
                $this->devicesResponse(5),
            ),
        ]);

        $this->postJson(
            "/telegraph/{$bot->token}/webhook",
            $this->callbackPayload($user->chat_id, 'action:deleteDevice;hwid:device-6'),
        )->assertNoContent();

        Http::assertSent(static fn(Request $request): bool => $request->method() === 'POST'
            && $request->url() === "https://panel.test/api/hwid/devices/delete"
            && $request->data() === ['userId' => $remoteId, 'hwid' => 'device-6']);
        Http::assertSent(static fn(Request $request): bool => $request->method() === 'POST'
            && $request->url() === "https://panel.test/api/users/{$remoteId}/actions/enable"
            && $request->body() === '');
        $telegraph->assertSent('✅ Устройство удалено.');

        $user->refresh();
        self::assertNull($user->device_limit_exceeded_at);
        self::assertNull($user->device_limit_notification_sent_at);
        self::assertSame(UserTags::Active, $user->tags);
    }

    /**
     * Verify that command is scheduled hourly without overlapping.
     *
     * @return void
     */
    public function test_command_is_scheduled_hourly_without_overlapping(): void
    {
        $event = collect(Schedule::events())->first(
            static fn(Event $event): bool => str_contains(
                $event->command,
                'subscriptions:enforce-device-limits',
            ),
        );

        self::assertNotNull($event);
        self::assertSame('0 * * * *', $event->expression);
        self::assertTrue($event->withoutOverlapping);
    }

    /**
     * Создаёт пользователя с оплаченным тарифом и заданным лимитом устройств.
     *
     * @param int $deviceLimit
     *
     * @return array{User, Plan, Product, Payment}
     */
    private function subscribedUser(int $deviceLimit): array
    {
        $user = User::factory()->create();
        $plan = Plan::factory()->create(['device_limit' => $deviceLimit]);
        $product = Product::factory()->create(['plan_id' => $plan->id]);
        $payment = Payment::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'status' => PaymentStatus::Succeeded,
            'processed_at' => now(),
        ]);

        return [$user, $plan, $product, $payment];
    }

    /**
     * Формирует страницу тестового потока пользователей Remnawave.
     *
     * @param list<array<string, mixed>> $users
     *
     * @return array<string, mixed>
     */
    private function streamResponse(array $users): array
    {
        return [
            'response' => [
                'users' => $users,
                'nextCursor' => null,
                'hasMore' => false,
            ],
        ];
    }

    /**
     * Формирует тестовый ответ Remnawave о подключённых устройствах.
     *
     * @param int $total
     *
     * @return array<string, mixed>
     */
    private function devicesResponse(int $total): array
    {
        return [
            'response' => [
                'total' => $total,
                'devices' => [],
            ],
        ];
    }

    /**
     * Формирует данные тестового устройства удалённого пользователя.
     *
     * @param int $remoteUserId
     *
     * @return array<string, mixed>
     */
    private function device(int $remoteUserId): array
    {
        return [
            'hwid' => 'device-1',
            'userId' => $remoteUserId,
            'platform' => 'Android',
            'osVersion' => '16',
            'deviceModel' => 'Pixel',
            'userAgent' => null,
            'requestIp' => null,
            'createdAt' => '2026-10-01T00:00:00.000Z',
            'updatedAt' => '2026-10-01T00:00:00.000Z',
        ];
    }

    /**
     * Формирует тестовые данные удалённого пользователя Remnawave.
     *
     * @param User $user
     * @param UserStatus $status
     *
     * @return array<string, mixed>
     */
    private function remoteUser(
        User $user,
        UserStatus $status = UserStatus::Active,
    ): array {
        return [
            'id' => $user->id + 1000,
            'shortUuid' => 'short-' . $user->id,
            'username' => $user->username,
            'status' => $status->value,
            'trafficLimitBytes' => 1000,
            'trafficLimitStrategy' => 'NO_RESET',
            'expireAt' => '2026-12-01T00:00:00.000Z',
            'telegramId' => $user->chat_id,
            'email' => null,
            'description' => null,
            'tag' => $user->tags->value,
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
     * Готовит Telegram-бота и чаты для проверки уведомлений.
     *
     * @param User $user
     *
     * @return TelegramBot
     */
    private function bot(User $user): TelegramBot
    {
        $bot = TelegramBot::query()->create([
            'token' => 'test-bot-token-' . $user->id,
            'name' => 'Test bot',
        ]);
        $bot->chats()->create([
            'chat_id' => $user->chat_id,
            'name' => 'Test chat',
        ]);

        return $bot;
    }

    /**
     * Формирует входящий callback Telegram с заданными чатом и действием.
     *
     * @param int $chatId
     * @param string $data
     *
     * @return array<string, mixed>
     */
    private function callbackPayload(int $chatId, string $data): array
    {
        return [
            'update_id' => 1,
            'callback_query' => [
                'id' => 77,
                'from' => [
                    'id' => $chatId,
                    'is_bot' => false,
                    'first_name' => 'Test',
                ],
                'message' => [
                    'message_id' => 10,
                    'date' => now()->timestamp,
                    'chat' => [
                        'id' => $chatId,
                        'type' => 'private',
                    ],
                ],
                'data' => $data,
            ],
        ];
    }

    /**
     * Проверяет отправку уведомления нужному пользователю.
     *
     * @param TelegraphFake $telegraph
     * @param User $user
     *
     * @return void
     */
    private function assertNotificationSent(TelegraphFake $telegraph, User $user): void
    {
        $telegraph->assertSentData(TelegraphClient::ENDPOINT_MESSAGE, [
            'chat_id' => $user->chat_id,
            'text' => self::MESSAGE,
            'reply_markup' => [
                'inline_keyboard' => [[[
                    'text' => 'Управление устройствами',
                    'callback_data' => 'action:devices',
                ]]],
            ],
        ]);
    }
}
