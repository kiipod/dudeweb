<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\ChatMessage;
use App\Models\Promocode;
use App\Models\TelegramBot;
use App\Models\User;
use DefStudio\Telegraph\Facades\Telegraph;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

final class TelegramRegistrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Verify that new user gets remote trial and local trial tag.
     *
     * @return void
     */
    public function test_new_user_gets_remote_trial_and_local_trial_tag(): void
    {
        config([
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'api-token',
        ]);
        Http::preventStrayRequests();
        Http::fake([
            'panel.test/api/users' => Http::response([
                'response' => $this->remoteUser(),
            ], 201),
        ]);
        ChatMessage::query()->create([
            'type' => 'welcome',
            'text' => 'Добро пожаловать',
            'status' => 'active',
        ]);
        $bot = TelegramBot::query()->create([
            'token' => 'registration-test-token',
            'name' => 'Test bot',
        ]);
        $telegraph = Telegraph::fake();

        $this->postJson(
            "/telegraph/{$bot->token}/webhook",
            $this->startPayload(),
        )->assertNoContent();

        $user = User::query()->where('chat_id', 123_456)->sole();

        self::assertSame(UserTags::Trial, $user->tags);
        $telegraph->assertSent('Добро пожаловать');
        Http::assertSent(fn(Request $request): bool => $request->method() === 'POST'
            && $request->url() === 'https://panel.test/api/users'
            && $request->data()['username'] === 'new_user'
            && $request->data()['tag'] === 'TRIAL'
            && $request->data()['telegramId'] === 123_456);
    }

    /**
     * Verify that failed remote registration does not mark local user as trial.
     *
     * @return void
     */
    public function test_failed_remote_registration_does_not_mark_local_user_as_trial(): void
    {
        config([
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'api-token',
        ]);
        Http::preventStrayRequests();
        Http::fake([
            'panel.test/api/users' => Http::response(['message' => 'unavailable'], 503),
        ]);
        ChatMessage::query()->create([
            'type' => 'welcome',
            'text' => 'Добро пожаловать',
            'status' => 'active',
        ]);
        $bot = TelegramBot::query()->create([
            'token' => 'failed-registration-test-token',
            'name' => 'Test bot',
        ]);
        Telegraph::fake();

        $this->postJson(
            "/telegraph/{$bot->token}/webhook",
            $this->startPayload(),
        )->assertNoContent();

        $user = User::query()->where('chat_id', 123_456)->sole();

        self::assertSame(UserTags::Inactive, $user->tags);
    }

    /**
     * Verify that expired existing user gets returning offer.
     *
     * @return void
     */
    public function test_expired_existing_user_gets_returning_offer(): void
    {
        config([
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'api-token',
        ]);
        Http::preventStrayRequests();
        Http::fake([
            'panel.test/api/users/by-username/*' => Http::response([
                'response' => $this->remoteUser(status: 'EXPIRED', tag: 'INACTIVE'),
            ]),
        ]);
        ChatMessage::query()->create([
            'type' => 'welcome_back',
            'text' => 'С возвращением',
            'status' => 'active',
        ]);
        $bot = TelegramBot::query()->create([
            'token' => 'returning-test-token',
            'name' => 'Test bot',
        ]);
        $user = User::factory()->create([
            'chat_id' => 123_456,
            'username' => 'new_user',
            'tags' => UserTags::Inactive,
            'welcome_back_shown_at' => null,
        ]);
        $telegraph = Telegraph::fake();

        $this->postJson(
            "/telegraph/{$bot->token}/webhook",
            $this->startPayload(),
        )->assertNoContent();

        self::assertNotNull($user->refresh()->welcome_back_shown_at);
        self::assertSame(1, Promocode::query()->where('user_id', $user->id)->count());
        $telegraph->assertSent('С возвращением');
    }

    /**
     * Формирует Telegram update с командой запуска бота.
     *
     * @return array<string, mixed>
     */
    private function startPayload(): array
    {
        return [
            'update_id' => 1,
            'message' => [
                'message_id' => 10,
                'date' => now()->timestamp,
                'text' => '/start',
                'entities' => [[
                    'offset' => 0,
                    'length' => 6,
                    'type' => 'bot_command',
                ]],
                'from' => [
                    'id' => 123_456,
                    'is_bot' => false,
                    'first_name' => 'New',
                    'last_name' => 'User',
                    'username' => 'new_user',
                    'is_premium' => false,
                ],
                'chat' => [
                    'id' => 123_456,
                    'type' => 'private',
                    'first_name' => 'New',
                    'last_name' => 'User',
                    'username' => 'new_user',
                ],
            ],
        ];
    }

    /**
     * Формирует тестовые данные удалённого пользователя Remnawave.
     *
     * @param string $status
     * @param string|null $tag
     *
     * @return array<string, mixed>
     */
    private function remoteUser(string $status = 'ACTIVE', ?string $tag = 'TRIAL'): array
    {
        return [
            'id' => 42,
            'shortUuid' => 'short',
            'username' => 'new_user',
            'status' => $status,
            'trafficLimitBytes' => 32_212_254_720,
            'trafficLimitStrategy' => 'NO_RESET',
            'expireAt' => now()->addDays(3)->utc()->toISOString(),
            'telegramId' => 123_456,
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
            'createdAt' => '2026-10-06T00:00:00.000Z',
            'updatedAt' => '2026-10-06T00:00:00.000Z',
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
