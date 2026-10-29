<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use App\Payment\Enums\PaymentSource;
use App\Payment\Enums\PaymentStatus;
use App\Payment\Exceptions\PaymentCreationException;
use App\Payment\PaymentCreator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;
use YooKassa\Client;

final class PaymentCreationRecoveryTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Keeps provider payload immutable and uses explicit months rather than name digits.
     *
     * @return void
     */
    public function test_creation_retry_preserves_payload_and_explicit_duration(): void
    {
        $requests = [];
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')->twice()->andReturnUsing(function (array $payload, string $key) use (&$requests): never {
            $requests[] = ['payload' => $payload, 'key' => $key];
            throw new \RuntimeException('Synthetic ambiguous transport failure.');
        });
        $this->app->instance(Client::class, $client);
        $user = User::factory()->create();
        $product = Product::factory()->create(['name' => 'Пакет на 30 дней', 'months' => 1, 'price' => 20000]);
        $creator = app(PaymentCreator::class);
        foreach ([20000, 30000] as $price) {
            $product->update(['price' => $price]);
            try {
                $creator->create($user, $product, source: PaymentSource::Telegram, returnUrl: 'https://audit.example.test/' . $price, idempotencyKey: 'immutable-intent');
                self::fail('Expected the synthetic transport error.');
            } catch (PaymentCreationException) {
            }
        }
        self::assertSame($requests[0], $requests[1]);
        $payment = Payment::query()->sole();
        self::assertSame(1, $payment->months);
        self::assertSame(20000, $payment->amount);
        self::assertNotNull($payment->provider_creation_failed_at);
        self::assertArrayNotHasKey('provider_request', $payment->toArray());
    }

    /**
     * Never replays an ambiguous POST beyond YooKassa's 24-hour idempotency window.
     *
     * @return void
     */
    public function test_expired_creation_window_requires_reconciliation_without_a_new_provider_request(): void
    {
        $this->freezeTime();
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')->once()->andThrow(new \RuntimeException('Synthetic lost response.'));
        $this->app->instance(Client::class, $client);
        $creator = app(PaymentCreator::class);
        $user = User::factory()->create();
        $product = Product::factory()->create();
        try {
            $creator->create($user, $product, idempotencyKey: 'expired-unknown-intent');
        } catch (PaymentCreationException) {
        }
        $this->travel(25)->hours();
        try {
            $creator->create($user, $product, idempotencyKey: 'expired-unknown-intent');
            self::fail('Expired idempotency guarantee must require reconciliation.');
        } catch (PaymentCreationException $exception) {
            self::assertStringContainsString('Нужна сверка', $exception->getMessage());
        }
        self::assertSame(PaymentStatus::Pending, Payment::query()->sole()->status);
    }

    /**
     * Legacy unknown requests cannot invent a fresh idempotency guarantee or payload.
     *
     * @return void
     */
    public function test_legacy_creation_without_snapshot_never_replays_automatically(): void
    {
        $client = Mockery::mock(Client::class);
        $client->shouldNotReceive('createPayment');
        $this->app->instance(Client::class, $client);
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $payment = Payment::factory()->for($user)->create(['product_id' => $product->id,
            'idempotency_key' => 'legacy-unknown-key', 'yookassa_payment_id' => null]);
        try {
            app(PaymentCreator::class)->create($user, $product, source: $payment->source, idempotencyKey: $payment->idempotency_key);
            self::fail('Unknown legacy payload must require reconciliation.');
        } catch (PaymentCreationException $exception) {
            self::assertStringContainsString('Нужна сверка', $exception->getMessage());
        }
        self::assertNull($payment->fresh()->provider_request);
    }

    /**
     * Requires explicit evidence before retiring an unknown creation outcome.
     *
     * @return void
     */
    public function test_failed_creation_can_be_retired_only_after_explicit_reconciliation(): void
    {
        $payment = Payment::factory()->create(['yookassa_payment_id' => null, 'provider_creation_failed_at' => now()]);
        $this->artisan('payments:reconcile-creation', ['payment' => $payment->id])->assertFailed();
        self::assertSame(PaymentStatus::Pending, $payment->fresh()->status);
        $this->artisan('payments:reconcile-creation', ['payment' => $payment->id, '--confirmed-absent' => true, '--reason' => 'Synthetic merchant audit reference'])->assertSuccessful();
        self::assertSame(PaymentStatus::Canceled, $payment->fresh()->status);
        self::assertSame('operator-confirmed-absent', $payment->fresh()->creation_resolution['outcome']);
    }

    /**
     * Recovers an old unknown creation without fabricating new snapshot or failure history.
     *
     * @return void
     */
    public function test_legacy_unknown_creation_can_be_explicitly_reconciled(): void
    {
        $payment = Payment::factory()->create(['yookassa_payment_id' => null]);
        self::assertNull($payment->provider_creation_failed_at);
        $this->artisan('payments:reconcile-creation', ['payment' => $payment->id,
            '--confirmed-absent' => true, '--reason' => 'Synthetic legacy merchant investigation'])->assertSuccessful();
        self::assertSame(PaymentStatus::Canceled, $payment->fresh()->status);
    }

    /**
     * Binds only a provider-verified invoice identity, never a mismatched payment.
     *
     * @return void
     */
    public function test_reconciliation_rejects_mismatched_provider_metadata(): void
    {
        $payment = Payment::factory()->create(['yookassa_payment_id' => null, 'provider_creation_failed_at' => now()]);
        $id = '23d93cac-000f-5000-8000-126628f15141';
        $data = ['id' => $id, 'status' => 'pending', 'amount' => ['value' => number_format($payment->amount / 100, 2, '.', ''), 'currency' => $payment->currency],
            'created_at' => '2026-10-29T10:00:00.000Z', 'paid' => false, 'refundable' => false, 'test' => true,
            'metadata' => ['payment_id' => (string) $payment->id, 'user_id' => (string) $payment->user_id,
                'product_id' => (string) $payment->product_id, 'source' => $payment->source->value]];
        $wrong = $data;
        $wrong['metadata']['user_id'] = '999999';
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('getPaymentInfo')->with($id)->twice()->andReturn(
            new \YooKassa\Request\Payments\PaymentResponse($wrong),
            new \YooKassa\Request\Payments\PaymentResponse($data),
        );
        $this->app->instance(Client::class, $client);
        $options = ['payment' => $payment->id, '--provider-id' => $id, '--reason' => 'Synthetic provider audit'];
        $this->artisan('payments:reconcile-creation', $options)->assertFailed();
        self::assertNull($payment->fresh()->yookassa_payment_id);
        $this->artisan('payments:reconcile-creation', $options)->assertSuccessful();
        self::assertSame($id, $payment->fresh()->yookassa_payment_id);
        self::assertSame('provider-verified', $payment->fresh()->creation_resolution['outcome']);
    }


}
