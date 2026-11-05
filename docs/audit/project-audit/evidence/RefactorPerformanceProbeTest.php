<?php

declare(strict_types=1);

namespace Tests\Audit;

use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use App\Payment\Enums\PaymentStatus;
use App\Services\Account\AccountReferralData;
use App\Services\Account\AccountSubscriptionData;
use App\Services\DeviceLimitEnforcementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/** Local performance measurements with synthetic data and blocked external HTTP. */
final class RefactorPerformanceProbeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Measures bounded query counts, a selective query plan and rate-limit handling.
     *
     * @return void
     */
    public function test_collect_local_performance_evidence(): void
    {
        config(['services.remnawave.api_url' => 'https://panel.test', 'services.remnawave.token' => 'audit-only']);
        Http::preventStrayRequests();
        $owner = User::factory()->create();
        $product = Product::factory()->create();
        $results = ['environment' => ['php' => PHP_VERSION, 'database' => DB::getDriverName(),
            'appEnv' => app()->environment(), 'dataset' => 'synthetic testing DB, RefreshDatabase'], 'queries' => []];
        foreach ([1, 40] as $size) {
            Payment::factory()->count($size === 1 ? 1 : 39)->for($owner)->create(['product_id' => $product->id]);
            User::factory()->count($size === 1 ? 1 : 39)->create(['referrer_user_id' => $owner->id]);
            foreach (['subscription' => fn() => app(AccountSubscriptionData::class)->forUser($owner),
                'referral' => fn() => app(AccountReferralData::class)->overview($owner)] as $scenario => $read) {
                DB::enableQueryLog();
                DB::flushQueryLog();
                $start = hrtime(true);
                $data = $read();
                $elapsed = (hrtime(true) - $start) / 1e6;
                $log = DB::getQueryLog();
                DB::disableQueryLog();
                $results['queries'][] = ['scenario' => $scenario, 'relatedRows' => $size,
                    'queryCount' => count($log), 'elapsedMs' => $elapsed,
                    'sqlMs' => array_sum(array_column($log, 'time')), 'payloadBytes' => strlen(json_encode($data)),
                    'returnedPaymentRows' => $scenario === 'subscription' ? count($data['payments']->items()) : null,
                    'sql' => array_column($log, 'query')];
                self::assertLessThanOrEqual(10, count($log));
                if ($scenario === 'subscription') {
                    self::assertLessThanOrEqual(10, count($data['payments']->items()));
                }
            }
        }
        User::factory()->count(1000)->create();
        DB::statement('ANALYZE users');
        $results['referralPlan'] = json_decode(DB::selectOne('EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT count(*) FROM users WHERE referrer_user_id = ?', [$owner->id])->{'QUERY PLAN'}, true);
        $remoteUsers = [];
        foreach (User::factory()->count(10)->create() as $user) {
            Payment::factory()->for($user)->create(['product_id' => $product->id, 'status' => PaymentStatus::Succeeded]);
            $remoteUsers[] = ['id' => $user->id + 1000, 'shortUuid' => 'audit', 'username' => $user->username,
                'telegramId' => $user->chat_id, 'status' => 'ACTIVE', 'tag' => 'ACTIVE',
                'expireAt' => '2027-01-01T00:00:00Z', 'trojanPassword' => 'audit-only',
                'vlessUuid' => '00000000-0000-4000-8000-000000000042', 'ssPassword' => 'audit-only',
                'createdAt' => '2026-10-01T00:00:00Z', 'updatedAt' => '2026-10-01T00:00:00Z',
                'subscriptionUrl' => 'https://audit.example.test/sub',
                'trafficLimitBytes' => 0, 'trafficLimitStrategy' => 'NO_RESET', 'lastTriggeredThreshold' => 0,
                'userTraffic' => ['usedTrafficBytes' => 0, 'lifetimeUsedTrafficBytes' => 0]];
        }
        $hwidCalls = 0;
        Http::fake([
            'panel.test/api/users/stream*' => Http::response(['response' => ['users' => $remoteUsers, 'hasMore' => false, 'nextCursor' => null]]),
            'panel.test/api/hwid/devices/*' => function () use (&$hwidCalls) {
                $hwidCalls++;
                return Http::response(['message' => 'audit rate limited'], 429, ['Retry-After' => '60']);
            },
        ]);
        DB::enableQueryLog();
        DB::flushQueryLog();
        $start = hrtime(true);
        $batch = app(DeviceLimitEnforcementService::class)->enforce();
        $results['rateLimit'] = ['users' => 10, 'retryAfterSeconds' => 60, 'hwidRequests' => $hwidCalls,
            'elapsedMs' => (hrtime(true) - $start) / 1e6, 'result' => $batch, 'queryCount' => count(DB::getQueryLog())];
        DB::disableQueryLog();
        self::assertSame(1, $hwidCalls);
        self::assertSame(1, $batch['failed']);
        $results['peakAllocatedMemoryBytes'] = memory_get_peak_usage(true);
        file_put_contents(__DIR__ . '/refactor-performance-backend.json', json_encode($results, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR) . "\n");
    }
}
