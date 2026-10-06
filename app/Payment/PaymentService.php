<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use App\Models\Product;
use App\Models\Promocode;
use App\Models\User;
use App\Payment\Enums\PaymentSource;

final readonly class PaymentService
{
    public function __construct(
        private PaymentCreator $paymentCreator,
        private PaymentNotificationHandler $paymentNotificationHandler,
    ) {}

    public function handleNotification(string $rawBody): void
    {
        $this->paymentNotificationHandler->handle($rawBody);
    }

    public function createPayment(
        User $user,
        Product $product,
        ?Promocode $promocode = null,
        PaymentSource|string $source = PaymentSource::Web,
        ?string $returnUrl = null,
        ?string $idempotencyKey = null,
    ): Payment {
        return $this->paymentCreator->create(
            $user,
            $product,
            $promocode,
            $source,
            $returnUrl,
            $idempotencyKey,
        );
    }
}
