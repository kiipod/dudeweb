<?php

declare(strict_types=1);

namespace App\Services\Account;

enum ConnectionPlatform: string
{
    case Windows = 'windows';
    case Macos = 'macos';
    case Linux = 'linux';
    case Android = 'android';
    case Ios = 'ios';

    /**
     * Возвращает подпись платформы, в том числе при недоступном каталоге.
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::Windows => 'Windows',
            self::Macos => 'macOS',
            self::Linux => 'Linux',
            self::Android => 'Android',
            self::Ios => 'iOS',
        };
    }
}
