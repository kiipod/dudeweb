<?php

declare(strict_types=1);

namespace App\Services\Auth;

enum ProvisioningState: string
{
    case Pending = 'pending';
    case Ready = 'ready';
    case ServiceError = 'service_error';
}
