<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\User;
use App\Remnawave\Enums\UserStatus;
use Illuminate\Console\Scheduling\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;
use Mockery;
use Tests\TestCase;

final class UserLifecycleSynchronizationTest extends TestCase
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

        config([
            'services.remnawave.api_url' => 'https://panel.test',
            'services.remnawave.token' => 'api-token',
        ]);

        Http::preventStrayRequests();
    }

    /**
     * Verify that external expiration and activation are synchronized.
     *
     * @return void
     */
    public function test_external_expiration_and_activation_are_synchronized(): void
    {
        $expired = User::factory()->create(['tags' => UserTags::Trial]);
        $active = User::factory()->create(['tags' => UserTags::Inactive]);
        $expiredRemote = $this->remoteUser($expired, UserStatus::Expired, UserTags::Trial);
        $activeRemote = $this->remoteUser($active, UserStatus::Active, UserTags::Active);
        Http::fake([
            'panel.test/api/users/stream*' => Http::response(
                $this->streamResponse([$expiredRemote, $activeRemote]),
            ),
            'panel.test/api/users' => Http::response([
                'response' => [...$expiredRemote, 'tag' => UserTags::Inactive->value],
            ]),
        ]);

        $this->artisan('users:synchronize-lifecycle')
            ->expectsOutput('User lifecycle states checked: 2.')
            ->expectsOutput('User lifecycle states changed: 2.')
            ->assertSuccessful();

        self::assertSame(UserTags::Inactive, $expired->refresh()->tags);
        self::assertSame(UserTags::Active, $active->refresh()->tags);
    }

    /**
     * Verify that repeated synchronization is idempotent.
     *
     * @return void
     */
    public function test_repeated_synchronization_is_idempotent(): void
    {
        $user = User::factory()->create(['tags' => UserTags::Active]);
        $user->forceFill(['updated_at' => '2026-01-01 00:00:00'])->saveQuietly();
        $this->fakeStream([
            $this->remoteUser($user, UserStatus::Active, UserTags::Active),
        ]);

        $this->artisan('users:synchronize-lifecycle')
            ->expectsOutput('User lifecycle states changed: 0.')
            ->assertSuccessful();
        $this->artisan('users:synchronize-lifecycle')
            ->expectsOutput('User lifecycle states changed: 0.')
            ->assertSuccessful();

        self::assertSame(
            '2026-01-01 00:00:00',
            $user->refresh()->updated_at?->format('Y-m-d H:i:s'),
        );
        Http::assertSentCount(2);
    }

    /**
     * Verify that special limited and disabled tags are preserved.
     *
     * @return void
     */
    public function test_special_limited_and_disabled_tags_are_preserved(): void
    {
        $family = User::factory()->create(['tags' => UserTags::Family]);
        $friends = User::factory()->create(['tags' => UserTags::Friends]);
        $limited = User::factory()->create(['tags' => UserTags::Trial]);
        $disabled = User::factory()->create(['tags' => UserTags::Active]);
        $remoteUsers = [
            $this->remoteUser($family, UserStatus::Expired, UserTags::Active),
            $this->remoteUser($friends, UserStatus::Expired, UserTags::Active),
            $this->remoteUser($limited, UserStatus::Limited, UserTags::Active),
            $this->remoteUser($disabled, UserStatus::Disabled, UserTags::Inactive),
        ];
        Http::fake([
            'panel.test/api/users/stream*' => Http::response($this->streamResponse($remoteUsers)),
            'panel.test/api/users' => Http::response(['response' => $remoteUsers[0]]),
        ]);

        $this->artisan('users:synchronize-lifecycle')
            ->expectsOutput('User lifecycle states checked: 4.')
            ->expectsOutput('User lifecycle states changed: 4.')
            ->assertSuccessful();

        self::assertSame(UserTags::Family, $family->refresh()->tags);
        self::assertSame(UserTags::Friends, $friends->refresh()->tags);
        self::assertSame(UserTags::Trial, $limited->refresh()->tags);
        self::assertSame(UserTags::Active, $disabled->refresh()->tags);
        Http::assertSentCount(5);
    }

    /**
     * Verify that remnawave failure is logged without corrupting local state.
     *
     * @return void
     */
    public function test_remnawave_failure_is_logged_without_corrupting_local_state(): void
    {
        $user = User::factory()->create(['tags' => UserTags::Active]);
        $remoteUser = $this->remoteUser($user, UserStatus::Expired, UserTags::Active);
        Log::spy();
        Http::fake([
            'panel.test/api/users/stream*' => Http::response($this->streamResponse([$remoteUser])),
            'panel.test/api/users' => Http::response(['message' => 'unavailable'], 503),
        ]);

        $this->artisan('users:synchronize-lifecycle')
            ->expectsOutput('User lifecycle states checked: 0.')
            ->expectsOutput('User lifecycle states changed: 0.')
            ->expectsOutput('User lifecycle synchronizations failed: 1.')
            ->assertFailed();

        self::assertSame(UserTags::Active, $user->refresh()->tags);
        Log::shouldHaveReceived('error')
            ->once()
            ->with(
                'User lifecycle synchronization failed.',
                Mockery::on(static fn(array $context): bool => $context['user_id'] === $user->id
                    && $context['remnawave_user_id'] === $remoteUser['id']
                    && $context['remnawave_status'] === UserStatus::Expired->value),
            );
    }

    /**
     * Verify that stream failure is logged without changing local state.
     *
     * @return void
     */
    public function test_stream_failure_is_logged_without_changing_local_state(): void
    {
        $user = User::factory()->create(['tags' => UserTags::Active]);
        Log::spy();
        Http::fake([
            'panel.test/api/users/stream*' => Http::response(['message' => 'unavailable'], 503),
        ]);

        $this->artisan('users:synchronize-lifecycle')
            ->expectsOutput('User lifecycle synchronization aborted.')
            ->assertFailed();

        self::assertSame(UserTags::Active, $user->refresh()->tags);
        Log::shouldHaveReceived('error')
            ->once()
            ->with(
                'User lifecycle synchronization aborted.',
                Mockery::on(static fn(array $context): bool => isset($context['exception'])
                    && array_key_exists('code', $context)),
            );
    }

    /**
     * Verify that cursor pagination and username fallback are supported.
     *
     * @return void
     */
    public function test_cursor_pagination_and_username_fallback_are_supported(): void
    {
        $first = User::factory()->create(['tags' => UserTags::Inactive]);
        $second = User::factory()->create(['tags' => UserTags::Inactive]);
        $firstRemote = $this->remoteUser($first, UserStatus::Active, UserTags::Active);
        $secondRemote = $this->remoteUser(
            $second,
            UserStatus::Active,
            UserTags::Active,
            includeTelegramId: false,
        );
        Http::fake(function (Request $request) use ($firstRemote, $secondRemote) {
            if ($request->method() === 'GET' && !str_contains($request->url(), 'cursor=')) {
                return Http::response($this->streamResponse([$firstRemote], 'next-page', true));
            }

            if ($request->method() === 'GET') {
                return Http::response($this->streamResponse([$secondRemote]));
            }

            return Http::response(['response' => $firstRemote]);
        });

        $this->artisan('users:synchronize-lifecycle')
            ->expectsOutput('User lifecycle states checked: 2.')
            ->assertSuccessful();

        self::assertSame(UserTags::Active, $first->refresh()->tags);
        self::assertSame(UserTags::Active, $second->refresh()->tags);
        Http::assertSent(static fn(Request $request): bool => str_contains(
            $request->url(),
            'cursor=next-page',
        ));
    }

    /**
     * Verify that command is scheduled hourly at fifteen without overlapping.
     *
     * @return void
     */
    public function test_command_is_scheduled_hourly_at_fifteen_without_overlapping(): void
    {
        $event = collect(Schedule::events())->first(
            static fn(Event $event): bool => str_contains(
                $event->command,
                'users:synchronize-lifecycle',
            ),
        );

        self::assertNotNull($event);
        self::assertSame('15 * * * *', $event->expression);
        self::assertTrue($event->withoutOverlapping);
    }

    /**
     * Подменяет поток пользователей Remnawave тестовыми страницами.
     *
     * @param list<array<string, mixed>> $users
     *
     * @return void
     */
    private function fakeStream(array $users): void
    {
        Http::fake([
            'panel.test/api/users/stream*' => Http::response($this->streamResponse($users)),
        ]);
    }

    /**
     * Формирует страницу тестового потока пользователей Remnawave.
     *
     * @param list<array<string, mixed>> $users
     * @param string|null $nextCursor
     * @param bool $hasMore
     *
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
     * Формирует тестовые данные удалённого пользователя Remnawave.
     *
     * @param User $user
     * @param UserStatus $status
     * @param UserTags $tag
     * @param bool $includeTelegramId
     *
     * @return array<string, mixed>
     */
    private function remoteUser(
        User $user,
        UserStatus $status,
        UserTags $tag,
        bool $includeTelegramId = true,
    ): array {
        return [
            'id' => $user->id + 1000,
            'shortUuid' => 'short-' . $user->id,
            'username' => $user->username,
            'status' => $status->value,
            'trafficLimitBytes' => 1000,
            'trafficLimitStrategy' => 'NO_RESET',
            'expireAt' => '2026-12-01T00:00:00.000Z',
            'telegramId' => $includeTelegramId ? $user->chat_id : null,
            'email' => null,
            'description' => null,
            'tag' => $tag->value,
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
