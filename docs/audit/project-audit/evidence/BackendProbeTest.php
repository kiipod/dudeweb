<?php

declare(strict_types=1);

namespace Tests\Audit;

use App\Bot\Telegram\Enums\UserTags;
use App\Enums\TelegramLinkState;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Promocode;
use App\Models\TelegramAccountLink;
use App\Models\User;
use App\Payment\Enums\PaymentSource;
use App\Payment\Enums\PaymentStatus;
use App\Payment\Exceptions\PaymentCreationException;
use App\Payment\PaymentCreator;
use App\Payment\SubscriptionExtender;
use App\Services\DeviceLimitEnforcementService;
use App\Services\Profile\TelegramAccountMerger;
use App\Services\PromocodeService;
use App\Services\UserLifecycleSynchronizationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;
use Mockery;
use Tests\TestCase;
use YooKassa\Client;

/** Diagnostic assertions reproduce current defects, not successful remediation. */
final class BackendProbeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Sets an isolated clock and blocks external requests.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow('2026-10-29T12:00:00Z');
        config(['services.remnawave.api_url' => 'https://panel.test', 'services.remnawave.token' => 'audit-token']);
        Http::preventStrayRequests();
    }

    /**
     * Restores the clock after every diagnostic.
     *
     * @return void
     */
    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    /**
     * Records that retrying an older target writes an earlier remote expiration.
     *
     * @return void
     */
    public function test_saved_payment_target_can_shorten_a_newer_subscription(): void
    {
        $user = User::factory()->web()->verified()->create(['remnawave_user_id' => 42, 'tags' => UserTags::Active]);
        $payment = Payment::factory()->for($user)->create([
            'subscription_expires_at' => '2026-12-01T00:00:00Z',
            'processing_token' => '00000000-0000-4000-8000-000000000042',
        ]);
        $remote = $this->remote('2027-01-01T00:00:00Z');
        Http::fake([
            'panel.test/api/users/42' => Http::response(['response' => $remote]),
            'panel.test/api/users' => Http::response(['response' => [...$remote, 'expireAt' => '2026-12-01T00:00:00Z']]),
        ]);
        app(SubscriptionExtender::class)->extend($payment);
        $target = $payment->subscription_expires_at->getTimestamp();
        self::assertLessThan(Carbon::parse($remote['expireAt'])->getTimestamp(), $target);
        Http::assertSent(fn(Request $request): bool => $request->method() === 'PATCH'
            && Carbon::parse($request['expireAt'])->getTimestamp() === $target);
    }

    /**
     * Records a skipped mapped web account in both scheduled batch processes.
     *
     * @return void
     */
    public function test_batch_mapping_skips_a_web_only_numeric_identity(): void
    {
        $user = User::factory()->web()->verified()->create([
            'remnawave_user_id' => 42, 'provisioning_key' => 'web_audit', 'username' => null, 'tags' => UserTags::Trial,
        ]);
        Payment::factory()->for($user)->create(['status' => PaymentStatus::Succeeded]);
        $remote = [...$this->remote(), 'username' => 'web_audit', 'status' => 'EXPIRED', 'tag' => 'TRIAL'];
        Http::fake(['panel.test/api/users/stream*' => function () use (&$remote) {
            return Http::response(['response' => ['users' => [$remote], 'hasMore' => false, 'nextCursor' => null]]);
        }]);
        $sync = app(UserLifecycleSynchronizationService::class)->synchronize();
        self::assertSame(0, $sync['checked']);
        self::assertSame(UserTags::Trial, $user->fresh()->tags);

        $remote['status'] = 'ACTIVE';
        $enforce = app(DeviceLimitEnforcementService::class)->enforce();
        self::assertSame(0, $enforce['checked']);
        Http::assertNotSent(fn(Request $request): bool => str_contains($request->url(), '/hwid/'));
    }

    /**
     * Records display-name duration overriding an explicit product month field.
     *
     * @return void
     */
    public function test_telegram_invoice_uses_name_digits_instead_of_months(): void
    {
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')->once()->andThrow(new \RuntimeException('audit provider unavailable'));
        $this->app->instance(Client::class, $client);
        $user = User::factory()->create();
        $product = Product::factory()->create(['name' => 'Пакет на 30 дней', 'months' => 1]);
        try {
            app(PaymentCreator::class)->create($user, $product, source: PaymentSource::Telegram, idempotencyKey: 'audit-duration');
        } catch (PaymentCreationException) {
        }
        $payment = Payment::query()->sole();
        self::assertSame(1, $product->months);
        self::assertSame(30, $payment->months);
    }

    /**
     * Records changed provider payload under an existing logical idempotency key.
     *
     * @return void
     */
    public function test_retry_recalculates_provider_amount_from_mutated_catalogue(): void
    {
        $requests = [];
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')->twice()->andReturnUsing(function (array $payload, string $key) use (&$requests): never {
            $requests[] = ['amount' => $payload['amount']['value'], 'key' => $key];
            throw new \RuntimeException('audit ambiguous provider response');
        });
        $this->app->instance(Client::class, $client);
        $creator = app(PaymentCreator::class);
        $user = User::factory()->web()->verified()->create();
        $product = Product::factory()->create(['price' => 20000]);
        foreach ([20000, 30000] as $price) {
            $product->update(['price' => $price]);
            try {
                $creator->create($user, $product, idempotencyKey: 'audit-same-intent');
            } catch (PaymentCreationException) {
            }
        }
        self::assertSame(['200.00', '300.00'], array_column($requests, 'amount'));
        self::assertSame($requests[0]['key'], $requests[1]['key']);
        self::assertSame(20000, Payment::query()->sole()->amount);
    }

    /**
     * Records a two-day-old creation failure blocking an otherwise ready merge.
     *
     * @return void
     */
    public function test_failed_creation_attempt_keeps_blocking_telegram_link(): void
    {
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')->once()->andThrow(new \RuntimeException('audit provider unavailable'));
        $this->app->instance(Client::class, $client);
        $user = User::factory()->web()->verified()->create(['remnawave_user_id' => 42]);
        $product = Product::factory()->create();
        try {
            app(PaymentCreator::class)->create($user, $product, idempotencyKey: 'audit-failed-attempt');
        } catch (PaymentCreationException) {
        }
        $payment = Payment::query()->sole();
        self::assertNull($payment->yookassa_payment_id);
        self::assertSame(PaymentStatus::Pending, $payment->status);
        Carbon::setTestNow(now()->addDays(2));
        $link = TelegramAccountLink::factory()->create([
            'user_id' => $user->id, 'state' => TelegramLinkState::Ready,
            'session_hash' => hash('sha256', 'audit-session'), 'telegram_chat_id' => 9001,
        ]);
        try {
            app(TelegramAccountMerger::class)->finish($user, $link->id, 'audit-session');
            self::fail('Expected the abandoned invoice to block merge preparation.');
        } catch (ValidationException $exception) {
            self::assertStringContainsString('Дождись завершения оплаты', $exception->errors()['telegram'][0]);
        }
        Http::assertNothingSent();
    }

    /**
     * Captures only the exception type for the known guest log-viewer failure.
     *
     * @return void
     */
    public function test_log_viewer_guest_raises_an_error(): void
    {
        $exception = null;
        try {
            $this->withoutExceptionHandling()->get('/log-viewer');
        } catch (\Throwable $caught) {
            $exception = $caught;
        }
        self::assertInstanceOf(\Error::class, $exception);
        self::assertSame('Call to a member function isSuperUser() on null', $exception->getMessage());
    }

    /**
     * Records the unique promo FK rejecting a campaign's second eligible user.
     *
     * @return void
     */
    public function test_shared_promocode_cannot_record_a_second_eligible_user(): void
    {
        $promo = Promocode::factory()->create(['count' => 2]);
        $first = User::factory()->create();
        $second = User::factory()->create();
        $service = app(PromocodeService::class);
        DB::transaction(fn() => $service->markAsUsed($promo, $first));
        try {
            DB::transaction(fn() => $service->markAsUsed($promo->fresh(), $second));
            self::fail('Expected the unique promocode_id constraint to reject the second user.');
        } catch (UniqueConstraintViolationException) {
            self::assertSame(1, $promo->fresh()->count);
            $this->assertDatabaseCount('user_promocodes', 1);
        }
        $schema = [];
        foreach (['users', 'payments', 'products', 'promocodes', 'user_promocodes', 'referral_rewards', 'support_tickets', 'support_messages', 'telegram_account_links'] as $table) {
            $schema[$table] = [
                'columns' => Schema::getColumnListing($table),
                'indexes' => Schema::getIndexes($table),
                'foreignKeys' => Schema::getForeignKeys($table),
            ];
        }
        file_put_contents(__DIR__ . '/backend-schema.json', json_encode($schema, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR) . "\n");
    }

    /**
     * Builds a minimal valid remote user without real service credentials.
     *
     * @param string $expiry
     *
     * @return array<string, mixed>
     */
    private function remote(string $expiry = '2026-12-01T00:00:00Z'): array
    {
        return [
            'id' => 42, 'shortUuid' => 'audit', 'username' => 'web_audit',
            'expireAt' => $expiry, 'telegramId' => null, 'status' => 'ACTIVE', 'tag' => 'ACTIVE',
            'trojanPassword' => 'audit-only', 'vlessUuid' => '00000000-0000-4000-8000-000000000042',
            'ssPassword' => 'audit-only', 'createdAt' => '2026-10-01T00:00:00Z',
            'updatedAt' => '2026-10-01T00:00:00Z', 'subscriptionUrl' => 'https://audit.example.test/sub',
            'userTraffic' => ['usedTrafficBytes' => 0, 'lifetimeUsedTrafficBytes' => 0],
            'trafficLimitBytes' => 0, 'trafficLimitStrategy' => 'NO_RESET', 'lastTriggeredThreshold' => 0,
        ];
    }
}
