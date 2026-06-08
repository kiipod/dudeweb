<?php

declare(strict_types=1);

namespace App\Bot\Telegram\Enums;

enum UserStatus: string
{
    // только создан
    case New = 'NEW';

    // активен trial
    case Trial = 'TRIAL';

    // есть подписка
    case Active = 'ACTIVE';

    // trial и подписка закончились
    case Inactive = 'INACTIVE';

    /**
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::New      => 'Новый',
            self::Trial    => 'Пробный период',
            self::Active   => 'Активная подписка',
            self::Inactive => 'Неактивен',
        };
    }
}
