<?php

declare(strict_types=1);

namespace App\Remnawave\Enums;

enum HostAlpn: string
{
    case H3 = 'h3';
    case H2 = 'h2';
    case Http11 = 'http/1.1';
    case H2Http11 = 'h2,http/1.1';
    case H3H2Http11 = 'h3,h2,http/1.1';
    case H3H2 = 'h3,h2';
}
