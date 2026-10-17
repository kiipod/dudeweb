<?php

declare(strict_types=1);

namespace App\Services\Landing\Enums;

enum PricingState: string
{
    case Ready = 'ready';
    case Empty = 'empty';
    case Unavailable = 'unavailable';
}
