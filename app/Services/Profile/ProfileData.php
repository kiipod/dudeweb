<?php

declare(strict_types=1);

namespace App\Services\Profile;

use App\Models\User;

final class ProfileData
{
    /**
     * Возвращает подтверждённые локальные поля без secret и provider identifiers.
     *
     * @param User $user
     *
     * @return array<string, mixed>
     */
    public function forUser(User $user): array
    {
        return [
            'user' => [
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'email' => $user->email,
                'registeredAt' => $user->created_at?->toIso8601String(),
                'registeredLabel' => $user->created_at?->translatedFormat('j F Y'),
            ],
            'telegramConnection' => [
                'connected' => $user->chat_id !== null,
                'username' => $user->chat_id !== null ? $user->username : null,
            ],
            'securityCapabilities' => [
                'password' => $user->password !== null,
                'changeEmail' => $user->password !== null && $user->remnawave_user_id !== null,
            ],
            'themePreference' => ['storage' => 'local', 'choices' => ['light', 'dark']],
        ];
    }
}
