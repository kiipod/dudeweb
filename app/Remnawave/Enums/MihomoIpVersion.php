<?php

declare(strict_types=1);

namespace App\Remnawave\Enums;

enum MihomoIpVersion: string
{
    case Dual = 'dual';
    case Ipv4 = 'ipv4';
    case Ipv6 = 'ipv6';
    case Ipv4Prefer = 'ipv4-prefer';
    case Ipv6Prefer = 'ipv6-prefer';
}
