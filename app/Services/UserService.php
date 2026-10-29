<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;

final class UserService
{
    /**
     * Принимает общий resolver приглашений двух каналов.
     *
     * @param ReferralInviteService $invites
     */
    public function __construct(private readonly ReferralInviteService $invites) {}

    /**
     * Разрешает новые opaque и прежние numeric Telegram invites.
     *
     * @param string $messageText
     * @param int $currentChatId
     *
     * @return User|null
     */
    public function getReferrer(string $messageText, int $currentChatId): ?User
    {
        if (preg_match('/\A\/start(?:@[A-Za-z0-9_]+)? ref_([A-Za-z0-9]{40})\z/', $messageText, $matches) === 1) {
            return $this->invites->resolve($matches[1], User::query()->where('chat_id', $currentChatId)->first());
        }
        if (preg_match('/\A\/start(?:@[A-Za-z0-9_]+)? ref_([0-9]{1,19})\z/', $messageText, $matches) !== 1) {
            return null;
        }
        $chatId = (int) $matches[1];
        return $chatId === $currentChatId ? null : User::query()->where('chat_id', $chatId)->first();
    }

    /**
     * Метод возвращает chat_id пользователя, который пригласил пользователя
     *
     * @param string $messageText
     * @param int $currentChatId
     *
     * @return int|null
     */
    public function getReferrerChatId(string $messageText, int $currentChatId): ?int
    {
        if (preg_match('/^\/start ref_(\d+)/', $messageText, $matches)) {
            $referrerChatId = (int) $matches[1];

            return $referrerChatId === $currentChatId ? null : $referrerChatId;
        }

        return null;
    }

    /**
     * Метод генерирует ссылку для партнерской программы
     *
     * @param int $chatId
     *
     * @return string|null
     */
    public function generatePartnerLink(int $chatId): ?string
    {
        $user = User::query()->where('chat_id', $chatId)->first();
        return $user === null ? null : $this->invites->links($user)['telegramInviteUrl'];
    }
}
