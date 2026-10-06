<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use App\Models\Product;
use App\Models\Promocode;
use App\Models\User;
use App\Payment\Enums\PaymentSource;
use App\Payment\Enums\PaymentStatus;
use App\Payment\Exceptions\PaymentCreationException;
use App\Services\PromocodeService;
use DomainException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;
use YooKassa\Client;
use YooKassa\Model\CurrencyCode;
use YooKassa\Model\Payment\Confirmation\ConfirmationRedirect;
use YooKassa\Model\Payment\ConfirmationType;

final readonly class PaymentCreator
{
    /**
     * @param Client $client
     * @param PromocodeService $promocodeService
     * @param PaymentReturnUrl $paymentReturnUrl
     */
    public function __construct(
        private Client $client,
        private PromocodeService $promocodeService,
        private PaymentReturnUrl $paymentReturnUrl,
    ) {}

    /**
     * @param User $user
     * @param Product $product
     * @param Promocode|null $promocode
     * @param PaymentSource|string $source
     * @param string|null $returnUrl
     * @param string|null $idempotencyKey
     * @return Payment
     */
    public function create(
        User $user,
        Product $product,
        ?Promocode $promocode = null,
        PaymentSource|string $source = PaymentSource::Web,
        ?string $returnUrl = null,
        ?string $idempotencyKey = null,
    ): Payment {
        $source = is_string($source) ? PaymentSource::from($source) : $source;
        $idempotencyKey ??= (string) Str::uuid();

        if ($idempotencyKey === '' || strlen($idempotencyKey) > 64) {
            throw new PaymentCreationException('Некорректный ключ идемпотентности.');
        }

        $existingPayment = Payment::query()->where('idempotency_key', $idempotencyKey)->first();

        if ($existingPayment !== null) {
            $this->ensureSameLogicalRequest($existingPayment, $user, $product, $promocode, $source);

            if ($existingPayment->yookassa_payment_id !== null) {
                return $existingPayment;
            }
        }

        if ($promocode !== null) {
            try {
                $this->promocodeService->validateForUser($promocode, $user);
            } catch (DomainException $exception) {
                throw new PaymentCreationException($exception->getMessage(), previous: $exception);
            }
        }

        $originalAmount = $product->price;
        $amount = $promocode === null
            ? $originalAmount
            : $this->promocodeService->calculatePrice($originalAmount, $promocode);
        $amount = max(0, $amount);

        $payment = $existingPayment ?? Payment::query()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'promocode_id' => $promocode?->id,
            'idempotency_key' => $idempotencyKey,
            'source' => $source,
            'months' => $this->resolveMonths($product),
            'original_amount' => $originalAmount,
            'status' => PaymentStatus::Pending,
            'amount' => $amount,
            'currency' => CurrencyCode::RUB,
            'description' => $this->description($product),
            'refundable' => false,
            'test' => false,
        ]);

        $metadata = [
            'payment_id' => (string) $payment->id,
            'user_id' => (string) $user->id,
            'product_id' => (string) $product->id,
            'source' => $source->value,
        ];

        $payment->update(['metadata' => $metadata]);

        try {
            $response = $this->client->createPayment([
                'amount' => [
                    'value' => number_format($amount / 100, 2, '.', ''),
                    'currency' => CurrencyCode::RUB,
                ],
                'capture' => true,
                'description' => $payment->description,
                'confirmation' => [
                    'type' => ConfirmationType::REDIRECT,
                    'return_url' => $this->paymentReturnUrl->generate($payment, $returnUrl),
                ],
                'metadata' => $metadata,
            ], $idempotencyKey);

            if ($response === null || $response->getId() === null) {
                throw new PaymentCreationException('YooKassa вернула пустой ответ.');
            }

            $confirmation = $response->getConfirmation();
            $confirmationUrl = $confirmation instanceof ConfirmationRedirect
                ? $confirmation->getConfirmationUrl()
                : null;

            if ($confirmationUrl === null) {
                throw new PaymentCreationException('YooKassa не вернула URL подтверждения.');
            }

            $recipient = $response->getRecipient();
            $responseAmount = $response->getAmount();

            $payment->update([
                'yookassa_payment_id' => $response->getId(),
                'confirmation_url' => $confirmationUrl,
                'status' => $response->getStatus() ?? PaymentStatus::Pending->value,
                'amount' => $responseAmount?->getIntegerValue() ?? $amount,
                'currency' => $responseAmount?->getCurrency() ?? CurrencyCode::RUB,
                'recipient_account_id' => $recipient?->getAccountId(),
                'recipient_gateway_id' => $recipient?->getGatewayId(),
                'refundable' => $response->getRefundable(),
                'test' => $response->getTest(),
            ]);

            Log::info('YooKassa payment created.', [
                'payment_id' => $payment->id,
                'yookassa_payment_id' => $response->getId(),
                'status' => $response->getStatus(),
            ]);

            return $payment->refresh();
        } catch (Throwable $exception) {
            Log::error('YooKassa payment creation failed.', [
                'payment_id' => $payment->id,
                'exception' => $exception::class,
                'code' => $exception->getCode(),
            ]);

            if ($exception instanceof PaymentCreationException) {
                throw $exception;
            }

            throw new PaymentCreationException(
                'Не удалось создать платёж. Попробуйте позже.',
                previous: $exception,
            );
        }
    }

    /**
     * @param Payment $payment
     * @param User $user
     * @param Product $product
     * @param Promocode|null $promocode
     * @param PaymentSource $source
     * @return void
     */
    private function ensureSameLogicalRequest(
        Payment $payment,
        User $user,
        Product $product,
        ?Promocode $promocode,
        PaymentSource $source,
    ): void {
        if (
            $payment->user_id !== $user->id
            || $payment->product_id !== $product->id
            || $payment->promocode_id !== $promocode?->id
            || $payment->source !== $source
        ) {
            throw new PaymentCreationException('Ключ идемпотентности уже использован для другого платежа.');
        }
    }

    /**
     * @param Product $product
     * @return int
     */
    private function resolveMonths(Product $product): int
    {
        if (preg_match('/\d+/', $product->name, $matches) !== 1) {
            throw new PaymentCreationException('Не удалось определить период продукта.');
        }

        return max(1, (int) $matches[0]);
    }

    /**
     * @param Product $product
     * @return string
     */
    private function description(Product $product): string
    {
        $product->loadMissing('plan');

        return sprintf('Тариф %s, %s', $product->plan->name, $product->name);
    }
}
