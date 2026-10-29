<?php

declare(strict_types=1);

namespace App\MoonShine\Enums;

enum MessageStatusEnum: string
{
    case Active = 'active';
    case Inactive = 'inactive';
    case Draft = 'draft';
    case Planned = 'planned';

    /**
     * Метод задает значение для вывода
     *
     * @return string|null
     */
    public function toString(): ?string
    {
        return match ($this) {
            self::Active => 'Активно',
            self::Inactive => 'Неактивно',
            self::Draft => 'Черновик',
            self::Planned => 'Запланировано',
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
            self::Active => 'success',
            self::Inactive => 'error',
            self::Draft => 'gray',
            self::Planned => 'warning',
        };
    }
}
