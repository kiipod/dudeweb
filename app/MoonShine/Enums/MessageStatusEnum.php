<?php

declare(strict_types=1);

namespace App\MoonShine\Enums;

enum MessageStatusEnum: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case DRAFT = 'draft';
    case PLANNED = 'planned';

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
            self::PLANNED => 'Запланировано',
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
            self::PLANNED => 'warning',
        };
    }
}
