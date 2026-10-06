<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use App\Payment\Exceptions\PaymentProcessingException;
use Illuminate\Support\Facades\Log;
use YooKassa\Client;
use YooKassa\Model\Notification\NotificationEventType;
use YooKassa\Model\Notification\NotificationFactory;
use YooKassa\Model\Payment\PaymentInterface;
use YooKassa\Model\Payment\PaymentStatus as YooKassaPaymentStatus;

final readonly class PaymentNotificationHandler
{
    public function __construct(
        private Client $client,
        private SuccessfulPaymentProcessor $successfulPaymentProcessor,
        private CanceledPaymentProcessor $canceledPaymentProcessor,
    ) {}

    public function handle(string $rawBody): void
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

            $this->successfulPaymentProcessor->process($payment->id);

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

            $this->canceledPaymentProcessor->process(
                $payment->id,
                $currentPayment->getCancellationDetails(),
            );
        }
    }
}
