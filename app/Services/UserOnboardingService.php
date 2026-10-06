<?php

declare(strict_types=1);

namespace App\Services;

use App\Bot\Telegram\Enums\OnboardingScenario;
use App\Bot\Telegram\Enums\UserTags;
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
        if ($user->wasRecentlyCreated) {
            return OnboardingScenario::Welcome;
        }

        // WelcomeBack
        if ($user->tags === UserTags::Inactive && $user->welcome_back_shown_at === null) {
            return OnboardingScenario::WelcomeBack;
        }

        // Обычный вход
        return OnboardingScenario::MainMenu;
    }
}
