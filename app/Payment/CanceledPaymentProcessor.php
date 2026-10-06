<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use App\Payment\Enums\PaymentStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use YooKassa\Model\CancellationDetailsInterface;
use YooKassa\Model\Notification\NotificationEventType;

final readonly class CanceledPaymentProcessor
{
    public function __construct(
        private PaymentCancellationResolver $paymentCancellationResolver,
        private PaymentStatusNotifier $paymentStatusNotifier,
    ) {}

    public function process(
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

        if ($payment->status !== PaymentStatus::Canceled) {
            return;
        }

        $this->paymentStatusNotifier->notify(
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
