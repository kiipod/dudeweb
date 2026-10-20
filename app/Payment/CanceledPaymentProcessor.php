<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use App\Payment\Enums\PaymentStatus;
use App\Payment\Enums\PaymentSource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use YooKassa\Model\CancellationDetailsInterface;
use YooKassa\Model\Notification\NotificationEventType;

final readonly class CanceledPaymentProcessor
{
    /**
     * Принимает зависимости для работы CanceledPaymentProcessor.
     *
     * @param PaymentCancellationResolver $paymentCancellationResolver
     * @param PaymentStatusNotifier $paymentStatusNotifier
     */
    public function __construct(
        private PaymentCancellationResolver $paymentCancellationResolver,
        private PaymentStatusNotifier $paymentStatusNotifier,
    ) {}

    /**
     * Фиксирует отмену платежа и отправляет пользователю доступное действие.
     *
     * @param int $paymentId
     * @param CancellationDetailsInterface|null $cancellationDetails
     *
     * @return void
     *
     * @throws \Throwable
     */
    public function process(
        int $paymentId,
        ?CancellationDetailsInterface $cancellationDetails,
    ): void {
        $payment = DB::transaction(function () use ($paymentId, $cancellationDetails): Payment {
            $payment = Payment::query()->lockForUpdate()->findOrFail($paymentId);

            if ($payment->status !== PaymentStatus::Succeeded && $payment->status !== PaymentStatus::Canceled) {
                $payment->update([
                    'status' => PaymentStatus::Canceled,
                    'processing_token' => null,
                    'processing_started_at' => null,
                    'notified_at' => null,
                    ...($payment->source === PaymentSource::Web ? [
                        'metadata' => [
                            ...($payment->metadata ?? []),
                            'cancellation_details' => [
                                'party' => $cancellationDetails?->getParty(),
                                'reason' => $cancellationDetails?->getReason(),
                            ],
                        ],
                    ] : []),
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
