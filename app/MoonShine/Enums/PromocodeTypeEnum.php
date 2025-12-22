<?php

declare(strict_types=1);

namespace App\MoonShine\Enums;

enum PromocodeTypeEnum: string
{
    case FIXED = 'fixed';
    case PERCENT = 'percent';

    /**
     * Метод задает значение для вывода
     *
     * @return string|null
     */
    public function toString(): ?string
    {
        return match ($this) {
            self::FIXED => 'Сумма',
            self::PERCENT => 'Проценты',
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
            self::FIXED => 'green',
            self::PERCENT => 'secondary',
        };
    }
}
