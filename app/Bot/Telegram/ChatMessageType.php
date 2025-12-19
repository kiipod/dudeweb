<?php

declare(strict_types=1);

namespace App\Bot\Telegram;

enum ChatMessageType: string
{
    case Welcome = 'welcome';
    case WelcomeBack = 'welcome_back';
    case WelcomeRef = 'welcome_ref';
    case Help = 'help';
    case Partners = 'partners';
    case Profile = 'profile';
    case Message = 'message';
}
