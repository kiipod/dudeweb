<?php

declare(strict_types=1);

namespace App\MoonShine\Enums;

enum ChatTypeEnum: string
{
    case WELCOME = 'welcome';
    case WELCOME_BACK = 'welcome_back';
    case WELCOME_REF = 'welcome_ref';
    case HELP = 'help';
    case PARTNERS = 'partners';
    case PROFILE = 'profile';
    case MESSAGE = 'message';
    case PLANS = 'plans';

    /**
     * Метод задает значение для вывода
     *
     * @return string|null
     */
    public function toString(): ?string
    {
        return match ($this) {
            self::WELCOME => 'Приветственное',
            self::WELCOME_BACK => 'С возвращением',
            self::WELCOME_REF => 'Привет рефералу',
            self::HELP => 'Помощь',
            self::PARTNERS => 'Партнерская программа',
            self::PROFILE => 'Профиль',
            self::MESSAGE => 'Сообщение',
            self::PLANS => 'Тарифы'
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
            self::WELCOME,
            self::WELCOME_BACK,
            self::WELCOME_REF,
            self::HELP,
            self::PARTNERS,
            self::PROFILE,
            self::PLANS,
            self::MESSAGE => 'blue',
        };
    }
}
