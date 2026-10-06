<?php

declare(strict_types=1);

namespace App\Services;

final class UserService
{
    /**
     * Метод возвращает chat_id пользователя, который пригласил пользователя
     *
     * @param string $messageText
     * @return int|null
     */
    public function getReferrerChatId(string $messageText): ?int
    {
        if (preg_match('/^\/start ref_(\d+)/', $messageText, $matches)) {
            return (int) $matches[1];
        }

        return null;
    }

    /**
     * Метод генерирует ссылку для партнерской программы
     *
     * @param int $chatId
     * @return string
     */
    public function generatePartnerLink(int $chatId): string
    {
        return "https://t.me/dudeweb_pro_bot?start=ref_{$chatId}";
    }
}
