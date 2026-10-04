<?php

declare(strict_types=1);

namespace App\Bot\Telegram\Enums;

enum UserTags: string
{
    case New = 'NEW';
    case Trial = 'TRIAL';
    case Active = 'ACTIVE';
    case Inactive = 'INACTIVE';
    case Friends = 'FRIENDS';
    case Family = 'FAMILY';

    /**
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::New => 'Новый',
            self::Trial => 'Пробный период',
            self::Active => 'Активная подписка',
            self::Inactive => 'Неактивен',
            self::Friends => 'Друзья',
            self::Family => 'Семья',
        };
    }
}
