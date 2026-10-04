<?php

declare(strict_types=1);

namespace App\Remnawave\Enums;

enum HostSecurityLayer: string
{
    case Default = 'DEFAULT';
    case Tls = 'TLS';
    case None = 'NONE';
}
