<?php

declare(strict_types=1);

namespace App\Services;

use App\Bot\Telegram\Enums\UserStatus;
use App\Models\User;
use App\Remnawave\RemnawaveApi;

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
     * Метод обновляет статус пользователя
     *
     * @param User $user
     * @return void
     */
    public function refreshStatus(User $user): void
    {
        $remnawaveApi = new RemnawaveApi();

        try {
            $remnaUser = $remnawaveApi->users()->getUserByUsername($user->username);
        } catch (\Throwable $e) {
            // пользователь ещё не создан в панеле
            return;
        }

        match ($remnaUser->response->tag) {
            'ACTIVE' => $user->update(['status' => UserStatus::Active]),
            'TRIAL'  => $user->update(['status' => UserStatus::Trial]),
            default  => $user->update(['status' => UserStatus::Inactive]),
        };
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
