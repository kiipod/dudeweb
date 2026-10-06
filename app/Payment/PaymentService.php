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
use App\Payment\Exceptions\PaymentProcessingException;
use App\Remnawave\DTO\UpdateUserRequestDto;
use App\Remnawave\RemnawaveApi;
use App\Services\PromocodeService;
use App\Services\ReferralService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use JsonException;
use Throwable;
use YooKassa\Client;
use YooKassa\Common\Exceptions\ApiException;
use YooKassa\Common\Exceptions\BadApiRequestException;
use YooKassa\Common\Exceptions\ExtensionNotFoundException;
use YooKassa\Common\Exceptions\ForbiddenException;
use YooKassa\Common\Exceptions\InternalServerError;
use YooKassa\Common\Exceptions\NotFoundException;
use YooKassa\Common\Exceptions\ResponseProcessingException;
use YooKassa\Common\Exceptions\TooManyRequestsException;
use YooKassa\Common\Exceptions\UnauthorizedException;
use YooKassa\Model\CurrencyCode;
use YooKassa\Model\CancellationDetailsInterface;
use YooKassa\Model\Notification\NotificationEventType;
use YooKassa\Model\Notification\NotificationFactory;
use YooKassa\Model\Payment\Confirmation\ConfirmationRedirect;
use YooKassa\Model\Payment\ConfirmationType;
use YooKassa\Model\Payment\PaymentInterface;
use YooKassa\Model\Payment\PaymentStatus as YooKassaPaymentStatus;

final readonly class PaymentService
{
    /**
     * @param Client $client
     * @param PromocodeService $promocodeService
     * @param PaymentCancellationResolver $paymentCancellationResolver
     * @param PaymentReturnUrl $paymentReturnUrl
     * @param RemnawaveApi $remnawaveApi
     * @param ReferralService $referralService
     * @param TelegramPaymentNotifier $telegramPaymentNotifier
     */
    public function __construct(
        private Client $client,
        private PromocodeService $promocodeService,
        private PaymentCancellationResolver $paymentCancellationResolver,
        private PaymentReturnUrl $paymentReturnUrl,
        private RemnawaveApi $remnawaveApi,
        private ReferralService $referralService,
        private TelegramPaymentNotifier $telegramPaymentNotifier,
    ) {}

    /**
     * @param string $rawBody
     * @return void
     * @throws JsonException
     * @throws Throwable
     * @throws ApiException
     * @throws BadApiRequestException
     * @throws ExtensionNotFoundException
     * @throws ForbiddenException
     * @throws InternalServerError
     * @throws NotFoundException
     * @throws ResponseProcessingException
     * @throws TooManyRequestsException
     * @throws UnauthorizedException
     */
    public function handleNotification(string $rawBody): void
    {
        $payload = json_decode($rawBody, true, flags: JSON_THROW_ON_ERROR);

        if (!is_array($payload)) {
            throw new \InvalidArgumentException('YooKassa notification must be a JSON object.');
        }

        $notification = new NotificationFactory()->factory($payload);
        $object = $notification->getObject();

        if (!$object instanceof PaymentInterface || $object->getId() === null) {
            throw new \InvalidArgumentException('YooKassa notification does not contain a payment.');
        }

        $yookassaPaymentId = $object->getId();
        $payment = Payment::query()
            ->where('yookassa_payment_id', $yookassaPaymentId)
            ->first();

        if ($payment === null) {
            Log::warning('YooKassa notification references an unknown payment.', [
                'yookassa_payment_id' => $yookassaPaymentId,
                'event' => $notification->getEvent(),
            ]);

            return;
        }

        $currentPayment = $this->client->getPaymentInfo($yookassaPaymentId);

        if ($currentPayment === null || $currentPayment->getId() !== $yookassaPaymentId) {
            throw new PaymentProcessingException('YooKassa did not confirm the payment state.');
        }

        $event = $notification->getEvent();
        $currentStatus = $currentPayment->getStatus();

        if ($event === NotificationEventType::PAYMENT_SUCCEEDED) {
            if ($currentStatus !== YooKassaPaymentStatus::SUCCEEDED) {
                Log::warning('Ignoring stale YooKassa succeeded notification.', [
                    'payment_id' => $payment->id,
                    'current_status' => $currentStatus,
                ]);

                return;
            }

            $this->processSucceeded($payment->id);

            return;
        }

        if ($event === NotificationEventType::PAYMENT_CANCELED) {
            if ($currentStatus !== YooKassaPaymentStatus::CANCELED) {
                Log::warning('Ignoring stale YooKassa canceled notification.', [
                    'payment_id' => $payment->id,
                    'current_status' => $currentStatus,
                ]);

                return;
            }

            $this->processCanceled($payment->id, $currentPayment->getCancellationDetails());
        }
    }

    /**
     * @param User $user
     * @param Product $product
     * @param Promocode|null $promocode
     * @param PaymentSource|string $source
     * @param string|null $returnUrl
     * @param string|null $idempotencyKey
     * @return Payment
     */
    public function createPayment(
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
            $this->promocodeService->validateForUser($promocode, $user);
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

    /**
     * @param int $paymentId
     * @return void
     * @throws Throwable
     * @throws \App\Remnawave\Exceptions\ApiException
     * @throws ConnectionException
     */
    private function processSucceeded(int $paymentId): void
    {
        $existingPayment = Payment::query()->findOrFail($paymentId);

        if ($existingPayment->status === PaymentStatus::Succeeded) {
            $this->notifyTelegram($existingPayment);

            return;
        }

        $payment = $this->claimProcessing($paymentId);

        if ($payment === null) {
            $this->notifyTelegram(Payment::query()->findOrFail($paymentId));

            return;
        }

        try {
            $remoteUser = null;
            $newEnd = $payment->subscription_expires_at;

            if ($newEnd === null) {
                $remoteUser = $this->remnawaveApi
                    ->users()
                    ->getUserByUsername($payment->user->username)
                    ->response;
                $currentEnd = Carbon::parse($remoteUser->expireAt);
                $baseDate = $currentEnd->isFuture() ? $currentEnd : now();
                $newEnd = $baseDate->copy()->addMonthsNoOverflow($payment->months);

                $this->storeSubscriptionEnd($payment, $newEnd);
            }

            $remoteUser ??= $this->remnawaveApi
                ->users()
                ->getUserByUsername($payment->user->username)
                ->response;

            $this->remnawaveApi->users()->update(new UpdateUserRequestDto(
                id: $remoteUser->id,
                expireAt: $newEnd->copy()->utc()->format('Y-m-d\TH:i:s.v\Z'),
            ));

            $payment = $this->completeSuccessfulPayment($payment);
        } catch (Throwable $exception) {
            $this->releaseProcessingClaim($payment);

            Log::error('YooKassa payment post-processing failed.', [
                'payment_id' => $payment->id,
                'yookassa_payment_id' => $payment->yookassa_payment_id,
                'exception' => $exception::class,
                'code' => $exception->getCode(),
            ]);

            throw $exception;
        }

        $this->notifyTelegram($payment);

        Log::info('YooKassa payment notification processed.', [
            'payment_id' => $payment->id,
            'yookassa_payment_id' => $payment->yookassa_payment_id,
            'event' => NotificationEventType::PAYMENT_SUCCEEDED,
            'status' => PaymentStatus::Succeeded->value,
        ]);
    }

    /**
     * @param int $paymentId
     * @param CancellationDetailsInterface|null $cancellationDetails
     * @return void
     * @throws Throwable
     */
    private function processCanceled(
        int $paymentId,
        ?CancellationDetailsInterface $cancellationDetails,
    ): void {
        $payment = DB::transaction(function () use ($paymentId): Payment {
            $payment = Payment::query()->lockForUpdate()->findOrFail($paymentId);

            if ($payment->status !== PaymentStatus::Succeeded && $payment->status !== PaymentStatus::Canceled) {
                $payment->update([
                    'status' => PaymentStatus::Canceled,
                    'processing_token' => null,
                    'processing_started_at' => null,
                    'notified_at' => null,
                ]);
            }

            return $payment->refresh();
        });

        if ($payment->status === PaymentStatus::Canceled) {
            $this->notifyTelegram(
                $payment,
                $this->paymentCancellationResolver->resolve($cancellationDetails),
            );

            Log::info('YooKassa payment notification processed.', [
                'payment_id' => $payment->id,
                'yookassa_payment_id' => $payment->yookassa_payment_id,
                'event' => NotificationEventType::PAYMENT_CANCELED,
                'status' => PaymentStatus::Canceled->value,
            ]);
        }
    }

    /**
     * @param int $paymentId
     * @return Payment|null
     * @throws Throwable
     */
    private function claimProcessing(int $paymentId): ?Payment
    {
        return DB::transaction(function () use ($paymentId): ?Payment {
            $payment = Payment::query()->lockForUpdate()->findOrFail($paymentId);

            if ($payment->status === PaymentStatus::Succeeded) {
                return null;
            }

            if (
                $payment->processing_token !== null
                && $payment->processing_started_at?->isAfter(now()->subMinutes(5))
            ) {
                throw new PaymentProcessingException('Payment is already being processed.');
            }

            $payment->update([
                'processing_token' => (string) Str::uuid(),
                'processing_started_at' => now(),
            ]);

            return $payment->refresh()->load('user');
        });
    }

    /**
     * @param Payment $claimedPayment
     * @param Carbon $newEnd
     * @return void
     * @throws Throwable
     */
    private function storeSubscriptionEnd(Payment $claimedPayment, Carbon $newEnd): void
    {
        DB::transaction(function () use ($claimedPayment, $newEnd): void {
            $payment = Payment::query()->lockForUpdate()->findOrFail($claimedPayment->id);

            if ($payment->processing_token !== $claimedPayment->processing_token) {
                throw new PaymentProcessingException('Payment processing claim was lost.');
            }

            $payment->update(['subscription_expires_at' => $newEnd]);
            $claimedPayment->setAttribute('subscription_expires_at', $newEnd);
        });
    }

    /**
     * @param Payment $claimedPayment
     * @return Payment
     * @throws Throwable
     */
    private function completeSuccessfulPayment(Payment $claimedPayment): Payment
    {
        return DB::transaction(function () use ($claimedPayment): Payment {
            $payment = Payment::query()
                ->with(['user', 'promocode'])
                ->lockForUpdate()
                ->findOrFail($claimedPayment->id);

            if ($payment->status === PaymentStatus::Succeeded) {
                return $payment;
            }

            if ($payment->processing_token !== $claimedPayment->processing_token) {
                throw new PaymentProcessingException('Payment processing claim was lost.');
            }

            if ($payment->promocode !== null) {
                $this->promocodeService->markAsUsed($payment->promocode, $payment->user);
            }

            $this->referralService->handlePayment($payment->user, $payment);

            $payment->update([
                'status' => PaymentStatus::Succeeded,
                'processed_at' => now(),
                'processing_token' => null,
                'processing_started_at' => null,
                'notified_at' => null,
            ]);

            return $payment->refresh();
        });
    }

    /**
     * @param Payment $claimedPayment
     * @return void
     */
    private function releaseProcessingClaim(Payment $claimedPayment): void
    {
        Payment::query()
            ->whereKey($claimedPayment->id)
            ->where('processing_token', $claimedPayment->processing_token)
            ->update([
                'processing_token' => null,
                'processing_started_at' => null,
            ]);
    }

    /**
     * @param Payment $payment
     * @param PaymentCancellation|null $cancellation
     * @return void
     * @throws Throwable
     */
    private function notifyTelegram(Payment $payment, ?PaymentCancellation $cancellation = null): void
    {
        if ($payment->source !== PaymentSource::Telegram) {
            return;
        }

        try {
            DB::transaction(function () use ($payment, $cancellation): void {
                $lockedPayment = Payment::query()->lockForUpdate()->findOrFail($payment->id);

                if ($lockedPayment->notified_at !== null) {
                    return;
                }

                if ($lockedPayment->status === PaymentStatus::Succeeded) {
                    $this->telegramPaymentNotifier->succeeded($lockedPayment);
                } elseif ($lockedPayment->status === PaymentStatus::Canceled) {
                    $this->telegramPaymentNotifier->canceled(
                        $lockedPayment,
                        $cancellation ?? $this->paymentCancellationResolver->resolve(null),
                    );
                } else {
                    return;
                }

                $lockedPayment->update(['notified_at' => now()]);
            });
        } catch (Throwable $exception) {
            Log::error('Telegram payment notification failed.', [
                'payment_id' => $payment->id,
                'exception' => $exception::class,
                'code' => $exception->getCode(),
            ]);

            throw $exception;
        }
    }
}
