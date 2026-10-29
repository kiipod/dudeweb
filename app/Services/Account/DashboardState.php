<?php

declare(strict_types=1);

namespace App\Services\Account;

enum DashboardState: string
{
    case Trial = 'trial';
    case Active = 'active';
    case Expiring = 'expiring';
    case Expired = 'expired';
    case Limited = 'limited';
}
