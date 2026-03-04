<?php

declare(strict_types=1);

namespace App\Services;

use App\Bot\Telegram\Enums\OnboardingScenario;
use App\Bot\Telegram\Enums\UserStatus;
use App\Models\User;

final class UserOnboardingService
{
    /**
     * Метод возвращает логику показа сообщений на команду /start в боте
     *
     * @param User $user
     * @return OnboardingScenario
     */
    public function resolveScenario(User $user): OnboardingScenario
    {
        // Новый пользователь
        if ($user->status === UserStatus::New) {
            return OnboardingScenario::Welcome;
        }

        // WelcomeBack
        if ($user->status === UserStatus::Inactive && $user->welcome_back_shown_at === null) {
            return OnboardingScenario::WelcomeBack;
        }

        // Обычный вход
        return OnboardingScenario::MainMenu;
    }
}
