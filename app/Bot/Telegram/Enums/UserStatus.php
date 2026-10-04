<?php

declare(strict_types=1);

namespace App\Bot\Telegram\Enums;

enum UserStatus: string
{
    case Active = 'ACTIVE';
    case Disabled = 'DISABLED';
    case Limited = 'LIMITED';
    case Expired = 'EXPIRED';

    /**
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::Active => 'Активный',
            self::Disabled => 'Заблокирован',
            self::Limited => 'Лимит трафика',
            self::Expired => 'Истек срок',
        };
    }
}
