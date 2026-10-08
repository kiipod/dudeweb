<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Bot\Telegram\Enums\UserTags;
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
     * @param TelegramUser|null $telegramUser
     * @param int|null $referrerUserId
     * @return User
     * @throws Exception
     */
    public function create(?TelegramUser $telegramUser, ?int $referrerUserId): User
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
                'trial_expired' => now()->addDays(3),
                'is_premium' => $telegramUser->isPremium(),
                'tags' => UserTags::Inactive,
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
