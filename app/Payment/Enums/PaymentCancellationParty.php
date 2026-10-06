<?php

declare(strict_types=1);

namespace App\Payment\Enums;

enum PaymentCancellationParty: string
{
    case Merchant = 'merchant';
    case YooMoney = 'yoo_money';
    case PaymentNetwork = 'payment_network';
}
