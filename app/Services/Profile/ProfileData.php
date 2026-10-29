<?php

declare(strict_types=1);

namespace App\Services\Profile;

use App\Models\User;

final class ProfileData
{
    /**
     * Принимает resolver безопасного статуса Telegram linking.
     *
     * @param TelegramLinkService $links
     */
    public function __construct(private readonly TelegramLinkService $links) {}

    /**
     * Возвращает подтверждённые локальные поля без secret и provider identifiers.
     *
     * @param User $user
     * @param string $sessionId
     *
     * @return array<string, mixed>
     */
    public function forUser(User $user, #[\SensitiveParameter] string $sessionId = ''): array
    {
        return [
            'user' => [
                'username' => $user->profile_username,
                'email' => $user->email,
                'registeredAt' => $user->created_at?->toIso8601String(),
                'registeredLabel' => $user->created_at?->translatedFormat('j F Y'),
            ],
            'telegramConnection' => [
                ...$this->links->status($user, $sessionId),
                'connected' => $user->chat_id !== null,
                'username' => $user->chat_id !== null ? $user->username : null,
            ],
            'securityCapabilities' => [
                'merging' => $user->telegram_merge_id !== null,
                'password' => $user->password !== null,
                'changeEmail' => $user->password !== null && $user->remnawave_user_id !== null,
            ],
            'themePreference' => ['storage' => 'local', 'choices' => ['light', 'dark']],
        ];
    }
}
