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
use Illuminate\Support\Facades\DB;
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
     * Принимает зависимости для работы PaymentCreator.
     *
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
     * Создаёт платёж YooKassa с устойчивым ключом идемпотентности.
     *
     * @param User $user
     * @param Product $product
     * @param Promocode|null $promocode
     * @param PaymentSource|string $source
     * @param string|null $returnUrl
     * @param string|null $idempotencyKey
     *
     * @return Payment
     *
     * @throws PaymentCreationException
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

        $existingPayment = Payment::query()
            ->with('promocode')
            ->where('idempotency_key', $idempotencyKey)
            ->first();

        if ($existingPayment !== null) {
            $this->ensureSameLogicalRequest($existingPayment, $user, $product, $promocode ?? $existingPayment->promocode, $source);
            if ($existingPayment->yookassa_payment_id !== null) {
                return $existingPayment;
            }
            if ($existingPayment->status !== PaymentStatus::Pending) {
                throw new PaymentCreationException('Эта попытка оплаты завершена. Создай новый платёж.');
            }
            if ($existingPayment->provider_request !== null) {
                return $this->submit($existingPayment, $returnUrl);
            }
            throw new PaymentCreationException('Для прежней попытки нет безопасного snapshot. Нужна сверка оплаты.');
        }

        try {
            $promocode = $this->promocodeService->resolveForPayment($user, $promocode);
        } catch (DomainException $exception) {
            throw new PaymentCreationException($exception->getMessage(), previous: $exception);
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

        $payment = DB::transaction(function () use ($user, $product, $promocode, $idempotencyKey, $source, $originalAmount, $amount): Payment {
            $owner = User::query()->lockForUpdate()->findOrFail($user->id);
            if ($owner->telegram_merge_id !== null) {
                throw new PaymentCreationException('Дождись завершения объединения аккаунтов и повтори оплату.');
            }
            // The merge uses the same user row lock. Recheck discount eligibility
            // before reserving an invoice that prevents a merge from starting.
            if ($promocode !== null) {
                try {
                    $this->promocodeService->validateForUser($promocode, $owner);
                } catch (DomainException $exception) {
                    throw new PaymentCreationException($exception->getMessage(), previous: $exception);
                }
            }
            return Payment::query()->create([
                'user_id' => $owner->id,
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
        });

        return $this->submit($payment, $returnUrl);
    }

    /**
     * Replays the immutable provider request of a reserved invoice.
     *
     * @param Payment $payment
     * @param string|null $returnUrl
     *
     * @return Payment
     *
     * @throws PaymentCreationException
     */
    private function submit(Payment $payment, ?string $returnUrl): Payment
    {
        $source = $payment->source;
        $amount = $payment->amount;
        $idempotencyKey = $payment->idempotency_key;
        $metadata = [
            'payment_id' => (string) $payment->id,
            'user_id' => (string) $payment->user_id,
            'product_id' => (string) $payment->product_id,
            'source' => $source->value,
        ];

        $payload = DB::transaction(function () use ($payment, $metadata, $amount, $returnUrl): array {
            $locked = Payment::query()->lockForUpdate()->findOrFail($payment->id);
            if ($locked->status !== PaymentStatus::Pending) {
                throw new PaymentCreationException('Эта попытка оплаты завершена. Создай новый платёж.');
            }
            if ($locked->provider_request !== null) {
                return $locked->provider_request;
            }
            $payload = [
                'amount' => ['value' => number_format($amount / 100, 2, '.', ''), 'currency' => $locked->currency],
                'capture' => true,
                'description' => $locked->description,
                'confirmation' => ['type' => ConfirmationType::REDIRECT, 'return_url' => $this->paymentReturnUrl->generate($locked, $returnUrl)],
                'metadata' => $metadata,
            ];
            $locked->update(['metadata' => $metadata, 'provider_request' => $payload, 'provider_request_expires_at' => now()->utc()->addHours(24)]);
            return $payload;
        });

        $payment->refresh();
        if ($payment->provider_request_expires_at === null || !$payment->provider_request_expires_at->isFuture()) {
            throw new PaymentCreationException('Срок безопасного повтора истёк. Нужна сверка предыдущей попытки оплаты.');
        }
        try {
            $response = $this->client->createPayment($payload, $idempotencyKey);

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
                'provider_creation_failed_at' => null,
                'confirmation_url' => $confirmationUrl,
                'status' => $source === PaymentSource::Web ? PaymentStatus::Pending : ($response->getStatus() ?? PaymentStatus::Pending->value),
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
            $payment->update(['provider_creation_failed_at' => now()]);
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
     * Отклоняет повторное использование ключа с другими параметрами покупки.
     *
     * @param Payment $payment
     * @param User $user
     * @param Product $product
     * @param Promocode|null $promocode
     * @param PaymentSource $source
     *
     * @return void
     *
     * @throws PaymentCreationException
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
     * Определяет длительность оплачиваемой подписки в месяцах.
     *
     * @param Product $product
     *
     * @return int
     *
     * @throws PaymentCreationException
     */
    private function resolveMonths(Product $product): int
    {
        if ($product->months === null || $product->months <= 0) {
            throw new PaymentCreationException('Для продукта не задан корректный период.');
        }
        return $product->months;
    }

    /**
     * Формирует описание покупки для YooKassa.
     *
     * @param Product $product
     *
     * @return string
     */
    private function description(Product $product): string
    {
        $product->loadMissing('plan');

        return sprintf('%s, %s', $product->plan->name, $product->name);
    }
}
