<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use DefStudio\Telegraph\DTO\User as TelegramUser;
use Exception;
use Illuminate\Support\Facades\Log;

final class UserRepository
{
    /**
     * @param int $chatId
     * @return User|null
     */
    public function getUserByChatId(int $chatId): ?User
    {
        return User::where('chat_id', $chatId)->first();
    }

    /**
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
     * @param TelegramUser|null $telegramUser
     * @param string|null $referrerUserId
     * @return User
     * @throws Exception
     */
    public function create(?TelegramUser $telegramUser, ?string $referrerUserId): User
    {
        try {
            $existingUser = $this->getUserByChatId($telegramUser->id());

            if ($existingUser) {
                $existingUser->update([
                    'first_name' => $telegramUser->firstName(),
                    'last_name' => $telegramUser->lastName(),
                    'username' => $telegramUser->username(),
                    'is_premium' => $telegramUser->isPremium(),
                ]);

                return $existingUser;
            }

            $userData = [
                'first_name' => $telegramUser->firstName(),
                'last_name' => $telegramUser->lastName(),
                'username' => $telegramUser->username(),
                'chat_id' => $telegramUser->id(),
                'is_trial' => true,
                'is_premium' => $telegramUser->isPremium(),
                'is_free' => false,
            ];

            // Добавляем реферера только если он существует
            if ($referrerUserId) {
                $userData['referrer_user_id'] = $referrerUserId;
            }

            return User::create($userData);

        } catch (\Exception $e) {
            Log::error('Ошибка создания пользователя Telegram: ' . $e->getMessage(), [
                'chat_id' => $telegramUser->id(),
                'username' => $telegramUser->username(),
            ]);

            throw $e;
        }
    }
}
