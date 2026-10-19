<?php

declare(strict_types=1);

namespace App\Services;

use App\Bot\Telegram\Enums\OnboardingScenario;
use App\Bot\Telegram\Enums\UserTags;
use App\Models\User;
use App\Remnawave\Enums\UserStatus;

final class UserOnboardingService
{
    /**
     * Метод возвращает логику показа сообщений на команду /start в боте
     *
     * @param User $user
     * @param UserStatus|null $remoteStatus
     *
     * @return OnboardingScenario
     */
    public function resolveScenario(User $user, ?UserStatus $remoteStatus): OnboardingScenario
    {
        // Новый пользователь
        if ($user->wasRecentlyCreated) {
            return OnboardingScenario::Welcome;
        }

        // WelcomeBack доступен только после подтверждённого Remnawave EXPIRED.
        if (
            $remoteStatus === UserStatus::Expired
            && $user->tags === UserTags::Inactive
            && $user->welcome_back_shown_at === null
        ) {
            return OnboardingScenario::WelcomeBack;
        }

        // Обычный вход
        return OnboardingScenario::MainMenu;
    }
}
