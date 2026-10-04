<?php

declare(strict_types=1);

namespace App\Remnawave\Enums;

enum UserStatus: string
{
    case Active = 'ACTIVE';
    case Disabled = 'DISABLED';
    case Limited = 'LIMITED';
    case Expired = 'EXPIRED';
}
