<?php

declare(strict_types=1);

namespace App\Payment\Enums;

enum PaymentSource: string
{
    case Web = 'web';
    case Telegram = 'telegram';
}
