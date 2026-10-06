<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use App\Payment\Enums\PaymentSource;
use App\Payment\Enums\PaymentStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class PaymentStatusNotifier
{
    /**
     * @param TelegramPaymentNotifier $telegramPaymentNotifier
     * @param PaymentCancellationResolver $paymentCancellationResolver
     */
    public function __construct(
        private TelegramPaymentNotifier $telegramPaymentNotifier,
        private PaymentCancellationResolver $paymentCancellationResolver,
    ) {}

    /**
     * @param Payment $payment
     * @param PaymentCancellation|null $cancellation
     * @return void
     * @throws Throwable
     */
    public function notify(Payment $payment, ?PaymentCancellation $cancellation = null): void
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
