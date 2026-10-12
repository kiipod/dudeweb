<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use App\Payment\Enums\PaymentStatus;
use App\Payment\Exceptions\PaymentProcessingException;
use App\Remnawave\Exceptions\ApiException;
use App\Services\PromocodeService;
use App\Services\ReferralRewardProcessor;
use App\Services\ReferralService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;
use YooKassa\Model\Notification\NotificationEventType;

final readonly class SuccessfulPaymentProcessor
{
    /**
     * @param SubscriptionExtender $subscriptionExtender
     * @param PromocodeService $promocodeService
     * @param ReferralService $referralService
     * @param ReferralRewardProcessor $referralRewardProcessor
     * @param PaymentStatusNotifier $paymentStatusNotifier
     */
    public function __construct(
        private SubscriptionExtender $subscriptionExtender,
        private PromocodeService $promocodeService,
        private ReferralService $referralService,
        private ReferralRewardProcessor $referralRewardProcessor,
        private PaymentStatusNotifier $paymentStatusNotifier,
    ) {}

    /**
     * @param int $paymentId
     * @return void
     * @throws Throwable
     * @throws ApiException
     * @throws ConnectionException
     */
    public function process(int $paymentId): void
    {
        $existingPayment = Payment::query()->findOrFail($paymentId);

        if ($existingPayment->status === PaymentStatus::Succeeded) {
            $this->notify($existingPayment);

            return;
        }

        $payment = $this->claim($paymentId);

        if ($payment === null) {
            $this->notify(Payment::query()->findOrFail($paymentId));

            return;
        }

        try {
            $this->subscriptionExtender->extend($payment);
            $payment = $this->complete($payment);
        } catch (Throwable $exception) {
            $this->releaseClaim($payment);

            Log::error('YooKassa payment post-processing failed.', [
                'payment_id' => $payment->id,
                'yookassa_payment_id' => $payment->yookassa_payment_id,
                'exception' => $exception::class,
                'code' => $exception->getCode(),
            ]);

            throw $exception;
        }

        $this->notify($payment);

        Log::info('YooKassa payment notification processed.', [
            'payment_id' => $payment->id,
            'yookassa_payment_id' => $payment->yookassa_payment_id,
            'event' => NotificationEventType::PAYMENT_SUCCEEDED,
            'status' => PaymentStatus::Succeeded->value,
        ]);
    }

    /**
     * @param int $paymentId
     * @return Payment|null
     * @throws Throwable
     */
    private function claim(int $paymentId): ?Payment
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
     * @return Payment
     * @throws Throwable
     */
    private function complete(Payment $claimedPayment): Payment
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
    private function releaseClaim(Payment $claimedPayment): void
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
     * @return void
     * @throws Throwable
     */
    private function notify(Payment $payment): void
    {
        try {
            $this->referralRewardProcessor->processForPayment($payment);
        } catch (Throwable $exception) {
            Log::error('Referral reward post-processing failed.', [
                'payment_id' => $payment->id,
                'exception' => $exception::class,
                'code' => $exception->getCode(),
            ]);
        }

        $this->paymentStatusNotifier->notify($payment);
    }
}
