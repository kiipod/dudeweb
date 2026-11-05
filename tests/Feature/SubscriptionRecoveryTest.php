<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\User;
use App\Payment\Exceptions\PaymentProcessingException;
use App\Payment\SubscriptionExtender;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

final class SubscriptionRecoveryTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Retains an ambiguous payment for reconciliation without shortening a newer expiry.
     *
     * @return void
     */
    public function test_stale_payment_target_does_not_overwrite_a_newer_subscription(): void
    {
        config(['services.remnawave.api_url' => 'https://panel.test', 'services.remnawave.token' => 'audit-only']);
        Http::preventStrayRequests();
        $user = User::factory()->create(['remnawave_user_id' => 42]);
        $payment = Payment::factory()->for($user)->create(['subscription_expires_at' => '2026-12-01T00:00:00Z']);
        Http::fake(['panel.test/api/users/42' => Http::response(['response' => $this->remote()])]);
        try {
            app(SubscriptionExtender::class)->extend($payment);
            self::fail('Ambiguous legacy target must require reconciliation.');
        } catch (PaymentProcessingException) {
            Http::assertSentCount(1);
        }
    }

    /**
     * Skips a previously confirmed mutation even after another extension has occurred.
     *
     * @return void
     */
    public function test_confirmed_payment_retry_does_not_repeat_remote_mutation(): void
    {
        Http::preventStrayRequests();
        $payment = Payment::factory()->create([
            'subscription_expires_at' => '2026-12-01T00:00:00Z',
            'subscription_applied_at' => now(),
        ]);
        app(SubscriptionExtender::class)->extend($payment);
        Http::assertNothingSent();
    }

    /**
     * Applies only a saved source or target and records successful remote delivery.
     *
     * @return void
     */
    public function test_saved_source_allows_safe_retry_and_persists_confirmation(): void
    {
        config(['services.remnawave.api_url' => 'https://panel.test', 'services.remnawave.token' => 'audit-only']);
        Http::preventStrayRequests();
        $user = User::factory()->create(['remnawave_user_id' => 42]);
        $payment = Payment::factory()->for($user)->create([
            'subscription_source_expires_at' => '2027-01-01T00:00:00Z',
            'subscription_expires_at' => '2027-02-01T00:00:00Z',
        ]);
        Http::fake([
            'panel.test/api/users/42' => Http::response(['response' => $this->remote()]),
            'panel.test/api/users' => Http::response(['response' => [...$this->remote(), 'expireAt' => '2027-02-01T00:00:00Z']]),
        ]);
        app(SubscriptionExtender::class)->extend($payment);
        self::assertNotNull($payment->fresh()->subscription_applied_at);
        Http::assertSentCount(2);
        app(SubscriptionExtender::class)->extend($payment->fresh());
        Http::assertSentCount(2);
    }

    /**
     * Rejects a stale processing claim before reading or changing provider state.
     *
     * @return void
     */
    public function test_lost_claim_cannot_recover_as_another_worker(): void
    {
        Http::preventStrayRequests();
        $payment = Payment::factory()->create();
        Payment::query()->whereKey($payment->id)->update(['processing_token' => '00000000-0000-4000-8000-000000000042']);
        try {
            app(SubscriptionExtender::class)->extend($payment);
            self::fail('Expected claim loss.');
        } catch (PaymentProcessingException) {
            Http::assertNothingSent();
        }
    }

    /**
     * Persists an expired subscription's target in UTC before a retry can read it.
     *
     * @return void
     */
    public function test_expired_subscription_preserves_the_exact_utc_target(): void
    {
        $this->freezeTime();
        $this->travelTo(now()->startOfSecond());
        config(['services.remnawave.api_url' => 'https://panel.test', 'services.remnawave.token' => 'audit-only']);
        Http::preventStrayRequests();
        $user = User::factory()->create(['remnawave_user_id' => 42]);
        $payment = Payment::factory()->for($user)->create(['months' => 1]);
        $remote = [...$this->remote(), 'expireAt' => now()->subDay()->utc()->toIso8601String()];
        $expected = now()->addMonthsNoOverflow()->utc();
        Http::fake([
            'panel.test/api/users/42' => Http::response(['response' => $remote]),
            'panel.test/api/users' => Http::response(['response' => [...$remote, 'expireAt' => $expected->toIso8601String()]]),
        ]);
        app(SubscriptionExtender::class)->extend($payment);
        self::assertTrue($payment->fresh()->subscription_expires_at->equalTo($expected));
        Http::assertSent(fn(\Illuminate\Http\Client\Request $request): bool => $request->method() === 'PATCH'
            && \Illuminate\Support\Carbon::parse($request['expireAt'])->equalTo($expected));
    }

    /**
     * Supplies a synthetic documented remote user without real credentials.
     *
     * @return array<string, mixed>
     */
    private function remote(): array
    {
        return ['id' => 42, 'shortUuid' => 'audit', 'username' => 'audit', 'telegramId' => null,
            'status' => 'ACTIVE', 'tag' => 'ACTIVE', 'expireAt' => '2027-01-01T00:00:00Z',
            'trojanPassword' => 'audit-only', 'vlessUuid' => '00000000-0000-4000-8000-000000000042',
            'ssPassword' => 'audit-only', 'createdAt' => '2026-10-01T00:00:00Z', 'updatedAt' => '2026-10-01T00:00:00Z',
            'subscriptionUrl' => 'https://audit.example.test/sub', 'trafficLimitBytes' => 0,
            'trafficLimitStrategy' => 'NO_RESET', 'lastTriggeredThreshold' => 0,
            'userTraffic' => ['usedTrafficBytes' => 0, 'lifetimeUsedTrafficBytes' => 0]];
    }
}
