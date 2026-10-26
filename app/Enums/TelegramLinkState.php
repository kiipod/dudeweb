<?php

declare(strict_types=1);

namespace App\Enums;

enum TelegramLinkState: string
{
    case Pending = 'pending';
    case AwaitingTelegram = 'awaiting_telegram';
    case Ready = 'ready';
    case Applying = 'applying';
    case RemoteApplied = 'remote_applied';
    case LocalApplied = 'local_applied';
    case Complete = 'complete';
    case Cancelled = 'cancelled';
}
