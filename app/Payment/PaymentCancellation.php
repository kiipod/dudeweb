<?php

declare(strict_types=1);

namespace App\Payment;

use App\Payment\Enums\PaymentCancellationParty;
use App\Payment\Enums\PaymentCancellationReason;

final readonly class PaymentCancellation
{
    /**
     * Сохраняет причину отмены, сообщение пользователю и доступность повторной оплаты.
     *
     * @param PaymentCancellationParty|null $party
     * @param PaymentCancellationReason|null $reason
     * @param string $message
     * @param bool $retryAllowed
     */
    public function __construct(
        public ?PaymentCancellationParty $party,
        public ?PaymentCancellationReason $reason,
        public string $message,
        public bool $retryAllowed,
    ) {}
}
