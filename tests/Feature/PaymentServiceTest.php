<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\Product;
use App\Models\Promocode;
use App\Models\User;
use App\Payment\Enums\PaymentSource;
use App\Payment\Enums\PaymentStatus;
use App\Payment\Exceptions\PaymentCreationException;
use App\Payment\PaymentService;
use App\Services\PromocodeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Mockery;
use Tests\TestCase;
use YooKassa\Client;
use YooKassa\Request\Payments\CreatePaymentResponse;

final class PaymentServiceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return void
     */
    public function test_invited_user_receives_automatic_first_payment_discount(): void
    {
        $referrer = User::factory()->create();
        $user = User::factory()->create(['referrer_user_id' => $referrer->id]);

        $this->assertAutomaticFirstPaymentDiscount($user, 'invited-first-payment');

        $this->assertDatabaseCount('referral_rewards', 0);
    }

    /**
     * @return void
     */
    public function test_returning_user_receives_automatic_first_payment_discount(): void
    {
        $user = User::factory()->create(['welcome_back_shown_at' => now()]);

        $this->assertAutomaticFirstPaymentDiscount($user, 'returning-first-payment');
    }

    public function test_it_creates_a_pending_yookassa_payment_with_discount_and_metadata(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['name' => '3 месяца', 'price' => 60_000]);
        $promocode = Promocode::factory()->create(['discount_value' => 30]);
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')
            ->once()
            ->withArgs(function (array $payload, string $key) use ($user, $product): bool {
                self::assertSame('420.00', $payload['amount']['value']);
                self::assertSame('RUB', $payload['amount']['currency']);
                self::assertTrue($payload['capture']);
                self::assertSame('redirect', $payload['confirmation']['type']);
                self::assertStringStartsWith(
                    'https://example.test/payments/return?payment_id=',
                    $payload['confirmation']['return_url'],
                );
                self::assertSame((string) $user->id, $payload['metadata']['user_id']);
                self::assertSame((string) $product->id, $payload['metadata']['product_id']);
                self::assertSame('telegram', $payload['metadata']['source']);
                self::assertSame('logical-request', $key);

                return true;
            })
            ->andReturn($this->response('420.00'));
        $this->app->instance(Client::class, $client);
        $service = app(PaymentService::class);
        $payment = $service->createPayment(
            $user,
            $product,
            $promocode,
            PaymentSource::Telegram,
            'https://example.test/payments/return',
            'logical-request',
        );

        self::assertSame(PaymentStatus::Pending, $payment->status);
        self::assertSame(PaymentSource::Telegram, $payment->source);
        self::assertSame(60_000, $payment->original_amount);
        self::assertSame(42_000, $payment->amount);
        self::assertSame(3, $payment->months);
        self::assertSame('23d93cac-000f-5000-8000-126628f15141', $payment->yookassa_payment_id);
        self::assertSame('https://yookassa.test/confirm', $payment->confirmation_url);
        self::assertSame((string) $payment->id, $payment->metadata['payment_id']);
        self::assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'pending',
            'product_id' => $product->id,
            'promocode_id' => $promocode->id,
        ]);
    }

    public function test_it_reuses_a_logical_request_and_its_idempotency_key(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')->once()->andReturn($this->response('200.00'));
        $this->app->instance(Client::class, $client);
        $service = app(PaymentService::class);

        $first = $service->createPayment(
            $user,
            $product,
            source: PaymentSource::Web,
            returnUrl: 'https://example.test/payments/return',
            idempotencyKey: 'same-logical-request',
        );
        $second = $service->createPayment(
            $user,
            $product,
            source: PaymentSource::Web,
            returnUrl: 'https://example.test/payments/return',
            idempotencyKey: 'same-logical-request',
        );

        self::assertSame($first->id, $second->id);
        self::assertSame(1, Payment::query()->count());
    }

    public function test_it_wraps_sdk_errors_without_logging_credentials(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')
            ->once()
            ->andThrow(new \RuntimeException('test_secret_key'));
        Log::spy();
        $this->app->instance(Client::class, $client);
        $service = app(PaymentService::class);

        try {
            $service->createPayment(
                $user,
                $product,
                returnUrl: 'https://example.test/payments/return',
            );
            self::fail('PaymentCreationException was not thrown.');
        } catch (PaymentCreationException $exception) {
            self::assertSame('Не удалось создать платёж. Попробуйте позже.', $exception->getMessage());
        }

        Log::shouldHaveReceived('error')
            ->once()
            ->with(
                'YooKassa payment creation failed.',
                Mockery::on(static fn(array $context): bool => !str_contains(
                    json_encode($context, JSON_THROW_ON_ERROR),
                    'test_secret_key',
                )),
            );
    }

    /**
     * @return void
     */
    public function test_failed_payment_creation_does_not_consume_automatic_promocode(): void
    {
        $user = User::factory()->create();
        $promocode = app(PromocodeService::class)->createForRefUser($user);
        $product = Product::factory()->create();
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')
            ->once()
            ->andThrow(new \RuntimeException('provider failure'));
        $this->app->instance(Client::class, $client);

        try {
            app(PaymentService::class)->createPayment(
                $user,
                $product,
                idempotencyKey: 'failed-automatic-payment',
            );
            self::fail('PaymentCreationException was not thrown.');
        } catch (PaymentCreationException) {
        }

        $this->assertDatabaseCount('user_promocodes', 0);
        self::assertTrue($promocode->is(app(PromocodeService::class)->automaticForUser($user)));
        self::assertSame(1, $promocode->refresh()->count);
    }

    /**
     * @return void
     */
    public function test_next_purchase_does_not_receive_consumed_automatic_promocode(): void
    {
        $user = User::factory()->create();
        $promocodeService = app(PromocodeService::class);
        $promocode = $promocodeService->createForRefUser($user);
        $promocodeService->markAsUsed($promocode, $user);
        $product = Product::factory()->create(['price' => 20_000]);
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')
            ->once()
            ->withArgs(static fn(array $payload): bool => $payload['amount']['value'] === '200.00')
            ->andReturn($this->response('200.00'));
        $this->app->instance(Client::class, $client);

        $payment = app(PaymentService::class)->createPayment(
            $user,
            $product,
            idempotencyKey: 'purchase-after-automatic',
        );

        self::assertNull($payment->promocode_id);
        self::assertSame(20_000, $payment->amount);
        self::assertNull($promocodeService->automaticForUser($user));
    }

    /**
     * @return void
     */
    public function test_payment_service_rejects_manual_promocode_when_automatic_is_active(): void
    {
        $user = User::factory()->create();
        app(PromocodeService::class)->createForRefUser($user);
        $manualPromocode = Promocode::factory()->create();
        $product = Product::factory()->create();
        $client = Mockery::mock(Client::class);
        $client->shouldNotReceive('createPayment');
        $this->app->instance(Client::class, $client);

        $this->expectException(PaymentCreationException::class);

        app(PaymentService::class)->createPayment(
            $user,
            $product,
            $manualPromocode,
            idempotencyKey: 'manual-over-automatic',
        );
    }

    public function test_payment_service_is_resolved_through_the_container(): void
    {
        self::assertInstanceOf(PaymentService::class, app(PaymentService::class));
    }

    /**
     * @param User $user
     * @param string $idempotencyKey
     * @return void
     */
    private function assertAutomaticFirstPaymentDiscount(User $user, string $idempotencyKey): void
    {
        $promocode = app(PromocodeService::class)->createForRefUser($user);
        $product = Product::factory()->create(['name' => '3 месяца', 'price' => 60_000]);
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')
            ->once()
            ->withArgs(static fn(array $payload): bool => $payload['amount']['value'] === '420.00')
            ->andReturn($this->response('420.00'));
        $this->app->instance(Client::class, $client);

        $payment = app(PaymentService::class)->createPayment(
            $user,
            $product,
            idempotencyKey: $idempotencyKey,
        );

        self::assertSame($promocode->id, $payment->promocode_id);
        self::assertSame(60_000, $payment->original_amount);
        self::assertSame(42_000, $payment->amount);
        $this->assertDatabaseCount('user_promocodes', 0);
    }

    /**
     * @param string $amount
     * @return CreatePaymentResponse
     */
    private function response(string $amount): CreatePaymentResponse
    {
        return new CreatePaymentResponse([
            'id' => '23d93cac-000f-5000-8000-126628f15141',
            'status' => 'pending',
            'recipient' => [
                'account_id' => '123',
                'gateway_id' => '456',
            ],
            'amount' => [
                'value' => $amount,
                'currency' => 'RUB',
            ],
            'created_at' => '2026-10-04T12:00:00.000Z',
            'confirmation' => [
                'type' => 'redirect',
                'return_url' => 'https://example.test/payments/return',
                'confirmation_url' => 'https://yookassa.test/confirm',
            ],
            'paid' => false,
            'refundable' => false,
            'test' => true,
            'metadata' => [],
        ]);
    }
}
