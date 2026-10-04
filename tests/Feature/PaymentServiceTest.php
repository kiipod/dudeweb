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
use App\Payment\PaymentReturnUrl;
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

        $service = new PaymentService(
            $client,
            app(PromocodeService::class),
            app(PaymentReturnUrl::class),
        );
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
        $service = new PaymentService(
            $client,
            app(PromocodeService::class),
            app(PaymentReturnUrl::class),
        );

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
        $service = new PaymentService(
            $client,
            app(PromocodeService::class),
            app(PaymentReturnUrl::class),
        );

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

    public function test_payment_service_is_resolved_through_the_container(): void
    {
        self::assertInstanceOf(PaymentService::class, app(PaymentService::class));
    }

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
