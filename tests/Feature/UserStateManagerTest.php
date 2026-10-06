<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\User;
use App\Remnawave\DTO\Response\UserResponse;
use App\Remnawave\Exceptions\ApiException;
use App\Services\UserStateManager;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

final class UserStateManagerTest extends TestCase
{
    use RefreshDatabase;

    /**
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
     * @return void
     */
    public function test_successful_registration_marks_user_as_trial(): void
    {
        $user = User::factory()->create(['tags' => UserTags::Inactive]);

        app(UserStateManager::class)->markTrial($user);

        self::assertSame(UserTags::Trial, $user->refresh()->tags);
    }

    /**
     * @return void
     */
    public function test_expired_trial_becomes_inactive(): void
    {
        $user = User::factory()->create(['tags' => UserTags::Trial]);
        $this->fakeRemoteUser(status: 'EXPIRED', tag: 'TRIAL');

        $tag = app(UserStateManager::class)->sync($user);

        self::assertSame(UserTags::Inactive, $tag);
        self::assertSame(UserTags::Inactive, $user->refresh()->tags);
    }

    /**
     * @return void
     */
    public function test_expired_active_subscription_becomes_inactive(): void
    {
        $user = User::factory()->create(['tags' => UserTags::Active]);
        $this->fakeRemoteUser(status: 'EXPIRED', tag: 'ACTIVE');

        app(UserStateManager::class)->sync($user);

        self::assertSame(UserTags::Inactive, $user->refresh()->tags);
    }

    /**
     * @return void
     */
    public function test_payment_reactivates_expired_remote_user_and_local_tag(): void
    {
        $user = User::factory()->create(['tags' => UserTags::Inactive]);
        $remoteUser = UserResponse::fromArray($this->remoteUser(
            status: 'EXPIRED',
            tag: 'ACTIVE',
        ));
        Http::fake([
            'panel.test/api/users' => Http::response(['response' => $this->remoteUser()]),
        ]);

        app(UserStateManager::class)->activateAfterPayment(
            $user,
            $remoteUser,
            Carbon::parse('2026-12-01 12:00:00', 'UTC'),
        );

        self::assertSame(UserTags::Active, $user->refresh()->tags);
        Http::assertSent(fn(Request $request): bool => $request->method() === 'PATCH'
            && $request->url() === 'https://panel.test/api/users'
            && $request->data() === [
                'id' => 42,
                'status' => 'ACTIVE',
                'expireAt' => '2026-12-01T12:00:00.000Z',
                'tag' => 'ACTIVE',
            ]);
    }

    /**
     * @return void
     */
    public function test_family_and_friends_survive_expired_sync(): void
    {
        foreach ([UserTags::Family, UserTags::Friends] as $specialTag) {
            $user = User::factory()->create(['tags' => $specialTag]);
            $this->fakeRemoteUser(status: 'EXPIRED', tag: 'ACTIVE');

            app(UserStateManager::class)->sync($user);

            self::assertSame($specialTag, $user->refresh()->tags);
        }
    }

    /**
     * @return void
     */
    public function test_payment_does_not_replace_family_or_friends_tag(): void
    {
        Http::fake([
            'panel.test/api/users' => Http::response(['response' => $this->remoteUser()]),
        ]);
        $manager = app(UserStateManager::class);

        foreach ([UserTags::Family, UserTags::Friends] as $specialTag) {
            $user = User::factory()->create(['tags' => $specialTag]);

            $manager->activateAfterPayment(
                $user,
                UserResponse::fromArray($this->remoteUser()),
                Carbon::parse('2026-12-01 12:00:00', 'UTC'),
            );

            self::assertSame($specialTag, $user->refresh()->tags);
        }

        Http::assertSent(fn(Request $request): bool => !array_key_exists('tag', $request->data()));
    }

    /**
     * @return void
     */
    public function test_repeated_sync_is_idempotent(): void
    {
        $user = User::factory()->create(['tags' => UserTags::Active]);
        $user->forceFill(['updated_at' => '2026-01-01 00:00:00'])->saveQuietly();
        $this->fakeRemoteUser(status: 'ACTIVE', tag: 'ACTIVE');

        $manager = app(UserStateManager::class);
        $manager->sync($user);
        $manager->sync($user);

        self::assertSame('2026-01-01 00:00:00', $user->refresh()->updated_at?->format('Y-m-d H:i:s'));
        Http::assertSentCount(2);
    }

    /**
     * @return void
     */
    public function test_failed_remote_activation_does_not_change_local_tag(): void
    {
        $user = User::factory()->create(['tags' => UserTags::Inactive]);
        Http::fake([
            'panel.test/api/users' => Http::response(['message' => 'unavailable'], 503),
        ]);

        try {
            app(UserStateManager::class)->activateAfterPayment(
                $user,
                UserResponse::fromArray($this->remoteUser(status: 'EXPIRED')),
                Carbon::parse('2026-12-01 12:00:00', 'UTC'),
            );
            self::fail('Remnawave exception was not thrown.');
        } catch (ApiException) {
        }

        self::assertSame(UserTags::Inactive, $user->refresh()->tags);
    }

    /**
     * @param string $status
     * @param string|null $tag
     * @return void
     */
    private function fakeRemoteUser(string $status, ?string $tag): void
    {
        Http::fake([
            'panel.test/api/users/by-username/*' => Http::response([
                'response' => $this->remoteUser($status, $tag),
            ]),
        ]);
    }

    /**
     * @param string $status
     * @param string|null $tag
     * @return array<string, mixed>
     */
    private function remoteUser(string $status = 'ACTIVE', ?string $tag = 'ACTIVE'): array
    {
        return [
            'id' => 42,
            'shortUuid' => 'short',
            'username' => 'test_user',
            'status' => $status,
            'trafficLimitBytes' => 1000,
            'trafficLimitStrategy' => 'NO_RESET',
            'expireAt' => '2026-11-01T00:00:00.000Z',
            'telegramId' => null,
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
}
