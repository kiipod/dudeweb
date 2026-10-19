<?php

declare(strict_types=1);

namespace App\Helpers;

use Carbon\Carbon;

final class StringHelper
{
    /**
     * Метод отвечает за проверку даты подписки
     *
     * @param string $expireAt
     *
     * @return bool
     */
    public function isSubscriptionActive(string $expireAt): bool
    {
        return Carbon::parse($expireAt)->isFuture();
    }

    /**
     * Мэтчинг названия страны из countryCode ноды
     *
     * @param string $code
     *
     * @return string
     */
    public function countryName(string $code): string
    {
        return match ($code) {
            'RU' => 'Россия',
            'DE' => 'Германия',
            'FR' => 'Франция',
            'NL' => 'Голандия',
            'US' => 'Америка',
            default => $code,
        };
    }

    /**
     * Форматирование байт из количества использованого трафика юзера
     *
     * @param float $bytes
     *
     * @return string
     */
    public function formatTraffic(float $bytes): string
    {
        $gb = $bytes / 1024 / 1024 / 1024;

        if ($gb >= 1) {
            return round($gb, 2) . ' Гб';
        }

        $mb = $bytes / 1024 / 1024;
        return round($mb, 2) . ' Мб';
    }
}
