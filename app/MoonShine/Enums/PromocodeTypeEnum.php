<?php

declare(strict_types=1);

namespace App\MoonShine\Enums;

enum PromocodeTypeEnum: string
{
    case Fixed = 'fixed';
    case Percent = 'percent';

    /**
     * Метод задает значение для вывода
     *
     * @return string|null
     */
    public function toString(): ?string
    {
        return match ($this) {
            self::Fixed => 'Сумма',
            self::Percent => 'Проценты',
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
            self::Fixed => 'green',
            self::Percent => 'secondary',
        };
    }
}
