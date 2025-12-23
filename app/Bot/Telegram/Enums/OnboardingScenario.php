<?php

declare(strict_types=1);

namespace App\Bot\Telegram\Enums;

enum OnboardingScenario
{
    case Welcome;
    case WelcomeBack;
    case MainMenu;
}
