<?php

declare(strict_types=1);

namespace App\MoonShine\Enums;

enum UserStatusEnum: string
{
    case NEW = 'new';
    case TRIAL = 'trial';
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';

    /**
     * Метод задает значение для вывода
     *
     * @return string|null
     */
    public function toString(): ?string
    {
        return match ($this) {
            self::NEW => 'Новый',
            self::TRIAL => 'Триал',
            self::ACTIVE => 'Активный',
            self::INACTIVE => 'Неактивный',
        };
    }

    /**
     * Метод задает цвет значка
     *
     * @return string|null
     */
    public function getColor(): ?string
    {
        return match ($this) {
            self::NEW, self::ACTIVE => 'success',
            self::TRIAL => 'danger',
            self::INACTIVE => 'error',
        };
    }
}
