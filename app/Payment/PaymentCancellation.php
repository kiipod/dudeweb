<?php

declare(strict_types=1);

namespace App\Payment;

use App\Payment\Enums\PaymentCancellationParty;
use App\Payment\Enums\PaymentCancellationReason;

final readonly class PaymentCancellation
{
    public function __construct(
        public ?PaymentCancellationParty $party,
        public ?PaymentCancellationReason $reason,
        public string $message,
        public bool $retryAllowed,
    ) {}
}
