<?php

declare(strict_types=1);

namespace App\MoonShine\Enums;

enum ChatTypeEnum: string
{
    case Welcome = 'welcome';
    case WelcomeBack = 'welcome_back';
    case WelcomeRef = 'welcome_ref';
    case Help = 'help';
    case Partners = 'partners';
    case Profile = 'profile';
    case Message = 'message';
    case Plans = 'plans';

    /**
     * Метод задает значение для вывода
     *
     * @return string|null
     */
    public function toString(): ?string
    {
        return match ($this) {
            self::Welcome => 'Приветственное',
            self::WelcomeBack => 'С возвращением',
            self::WelcomeRef => 'Привет рефералу',
            self::Help => 'Помощь',
            self::Partners => 'Партнерская программа',
            self::Profile => 'Профиль',
            self::Message => 'Сообщение',
            self::Plans => 'Тарифы',
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
            self::Welcome,
            self::WelcomeBack,
            self::WelcomeRef,
            self::Help,
            self::Partners,
            self::Profile,
            self::Plans,
            self::Message => 'blue',
        };
    }
}
