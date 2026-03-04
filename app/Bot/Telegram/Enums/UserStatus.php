<?php

declare(strict_types=1);

namespace App\Bot\Telegram\Enums;

enum UserStatus: string
{
    // только создан
    case New = 'new';

    // активен trial
    case Trial = 'trial';

    // есть подписка
    case Active = 'active';

    // trial и подписка закончились
    case Inactive = 'inactive';

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
