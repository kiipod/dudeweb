<?php

declare(strict_types=1);

namespace App\Remnawave\Enums;

enum NodeIpStatus: string
{
    case Inbound = 'INBOUND';
    case Outbound = 'OUTBOUND';
    case Management = 'MANAGEMENT';
    case Transit = 'TRANSIT';
    case Monitoring = 'MONITORING';
    case Reserve = 'RESERVE';
    case Blocked = 'BLOCKED';
    case Flagged = 'FLAGGED';
    case Deprecated = 'DEPRECATED';
    case Unknown = 'UNKNOWN';
}
