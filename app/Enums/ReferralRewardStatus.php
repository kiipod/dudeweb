<?php

declare(strict_types=1);

namespace App\Enums;

enum ReferralRewardStatus: string
{
    case Legacy = 'legacy';
    case Pending = 'pending';
    case Applied = 'applied';
    case Conflict = 'conflict';

    /**
     * Возвращает подпись статуса для административного интерфейса.
     *
     * @return string
     */
    public function toString(): string
    {
        return match ($this) {
            self::Legacy => 'Историческое',
            self::Pending => 'Ожидает начисления',
            self::Applied => 'Начислено',
            self::Conflict => 'Требует проверки',
        };
    }

    /**
     * Возвращает цвет статуса для административного интерфейса.
     *
     * @return string
     */
    public function getColor(): string
    {
        return match ($this) {
            self::Legacy => 'gray',
            self::Pending => 'warning',
            self::Applied => 'success',
            self::Conflict => 'error',
        };
    }
}
