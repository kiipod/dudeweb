<?php

declare(strict_types=1);

namespace App\Remnawave\Enums;

enum TrafficLimitStrategy: string
{
    case NoReset = 'NO_RESET';
    case Day = 'DAY';
    case Week = 'WEEK';
    case Month = 'MONTH';
    case MonthRolling = 'MONTH_ROLLING';
}
