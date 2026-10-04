<?php

declare(strict_types=1);

namespace App\Remnawave\Enums;

enum InternalSquadMode: string
{
    case Exclude = 'EXCLUDE';
    case AllowOnly = 'ALLOW_ONLY';
}
