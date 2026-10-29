<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use App\Payment\Enums\PaymentStatus;
use App\Remnawave\DTO\Response\UserResponse;
use App\Services\DeviceLimitEnforcementService;
use App\Services\RemoteUserMapping;
use App\Services\UserLifecycleSynchronizationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

final class BatchIdentityAndCooldownTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Numeric web mapping participates in lifecycle and device enforcement.
     *
     * @return void
     */
    public function test_web_numeric_identity_is_included_in_scheduled_batches(): void
    {
        config(['services.remnawave.api_url' => 'https://panel.test', 'services.remnawave.token' => 'synthetic']);
        Http::preventStrayRequests();
        $user = User::factory()->web()->verified()->create(['remnawave_user_id' => 42, 'tags' => UserTags::Trial]);
        Payment::factory()->for($user)->create(['status' => PaymentStatus::Succeeded]);
        $remote = [...$this->remote(), 'status' => 'EXPIRED', 'tag' => 'TRIAL'];
        Http::fake([
            'panel.test/api/users/stream*' => fn() => Http::response(['response' => ['users' => [$remote], 'hasMore' => false, 'nextCursor' => null]]),
            'panel.test/api/users' => Http::response(['response' => [...$remote, 'tag' => 'INACTIVE']]),
            'panel.test/api/hwid/devices/42' => Http::response(['response' => ['total' => 0, 'devices' => []]]),
        ]);
        self::assertSame(1, app(UserLifecycleSynchronizationService::class)->synchronize()['checked']);
        self::assertSame(UserTags::Inactive, $user->fresh()->tags);
        // A fresh fake replaces the stream status while retaining exact endpoint fixtures.
        Http::swap(new \Illuminate\Http\Client\Factory());
        Http::preventStrayRequests();
        Http::fake([
            'panel.test/api/users/stream*' => Http::response(['response' => ['users' => [$this->remote()], 'hasMore' => false, 'nextCursor' => null]]),
            'panel.test/api/hwid/devices/42' => Http::response(['response' => ['total' => 0, 'devices' => []]]),
        ]);
        self::assertSame(1, app(DeviceLimitEnforcementService::class)->enforce()['checked']);
    }

    /**
     * Does not reassign a known numeric identity through a conflicting legacy username.
     *
     * @return void
     */
    public function test_conflicting_legacy_identity_is_not_matched(): void
    {
        User::factory()->web()->verified()->create(['remnawave_user_id' => 99, 'username' => 'audit']);
        self::assertCount(0, app(RemoteUserMapping::class)->forPage([UserResponse::fromArray($this->remote())]));
    }

    /**
     * Stops a rate-limited page and defers later runs for the provider cooldown.
     *
     * @return void
     */
    public function test_hwid_rate_limit_defers_remaining_requests(): void
    {
        config(['services.remnawave.api_url' => 'https://panel.test', 'services.remnawave.token' => 'synthetic']);
        Http::preventStrayRequests();
        $rows = [];
        $product = Product::factory()->create();
        foreach (User::factory()->count(3)->create() as $user) {
            Payment::factory()->for($user)->create(['product_id' => $product->id, 'status' => PaymentStatus::Succeeded]);
            $rows[] = [...$this->remote(), 'id' => $user->id + 1000, 'telegramId' => $user->chat_id, 'username' => $user->username];
        }
        Http::fake([
            'panel.test/api/users/stream*' => Http::response(['response' => ['users' => $rows, 'hasMore' => false, 'nextCursor' => null]]),
            'panel.test/api/hwid/devices/*' => Http::response(['message' => 'Synthetic rate limit'], 429, ['Retry-After' => '60']),
        ]);
        self::assertSame(1, app(DeviceLimitEnforcementService::class)->enforce()['failed']);
        Http::assertSentCount(2);
        app(DeviceLimitEnforcementService::class)->enforce();
        Http::assertSentCount(2);
        $this->travel(61)->seconds();
        app(DeviceLimitEnforcementService::class)->enforce();
        Http::assertSentCount(4);
    }

    /**
     * Preserves numeric/date Retry-After and uses the bounded scheduler default for malformed input.
     *
     * @return void
     */
    public function test_retry_after_metadata_accepts_http_dates_and_rejects_invalid_values(): void
    {
        $this->freezeTime();
        config(['services.remnawave.api_url' => 'https://panel.test', 'services.remnawave.token' => 'synthetic']);
        Http::preventStrayRequests();
        Http::fake(['panel.test/api/users/42' => Http::sequence()
            ->push(['message' => 'limit'], 429, ['Retry-After' => now()->addSeconds(60)->utc()->format(DATE_RFC7231)])
            ->push(['message' => 'limit'], 429, ['Retry-After' => 'not-a-retry-time'])
            ->push(['message' => 'limit'], 429, ['Retry-After' => '60'])]);
        foreach ([60, null, 60] as $expected) {
            try {
                app(\App\Remnawave\RemnawaveApi::class)->users()->getUserById(42);
                self::fail('Expected rate limit metadata.');
            } catch (\App\Remnawave\Exceptions\ApiException $exception) {
                self::assertSame($expected, $exception->retryAfterSeconds);
            }
        }
    }

    /**
     * Returns a synthetic valid provider user.
     *
     * @return array<string, mixed>
     */
    private function remote(): array
    {
        return ['id' => 42, 'shortUuid' => 'audit', 'username' => 'audit', 'telegramId' => null,
            'status' => 'ACTIVE', 'tag' => 'ACTIVE', 'expireAt' => '2027-01-01T00:00:00Z',
            'trojanPassword' => 'synthetic', 'vlessUuid' => '00000000-0000-4000-8000-000000000042',
            'ssPassword' => 'synthetic', 'createdAt' => '2026-10-01T00:00:00Z', 'updatedAt' => '2026-10-01T00:00:00Z',
            'subscriptionUrl' => 'https://audit.example.test/sub', 'trafficLimitBytes' => 0,
            'trafficLimitStrategy' => 'NO_RESET', 'lastTriggeredThreshold' => 0,
            'userTraffic' => ['usedTrafficBytes' => 0, 'lifetimeUsedTrafficBytes' => 0]];
    }
}
