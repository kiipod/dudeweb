<?php

declare(strict_types=1);

namespace App\MoonShine\Enums;

enum StatusEnum: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case DRAFT = 'draft';

    /**
     * Метод задает значение для вывода
     *
     * @return string|null
     */
    public function toString(): ?string
    {
        return match ($this) {
            self::ACTIVE => 'Активно',
            self::INACTIVE => 'Неактивно',
            self::DRAFT => 'Черновик',
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
            self::ACTIVE => 'success',
            self::INACTIVE => 'error',
            self::DRAFT => 'gray',
        };
    }
}
