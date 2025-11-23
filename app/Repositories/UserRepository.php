<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use DefStudio\Telegraph\DTO\User as TelegramUser;
use Exception;
use Illuminate\Support\Facades\Log;

final class TelegramRepository
{
    /**
     * @param int $chatId
     * @return User
     */
    public function findUserByChatId(int $chatId): User
    {
        return User::where('chat_id', $chatId)->first();
    }

    /**
     * @param TelegramUser|null $telegramUser
     * @return User
     * @throws Exception
     */
    public function createUser(?TelegramUser $telegramUser): User
    {
        try {
            $existingUser = User::where('chat_id', $telegramUser->id())->first();

            if ($existingUser) {
                $existingUser->update([
                    'first_name' => $telegramUser->firstName(),
                    'last_name' => $telegramUser->lastName(),
                    'username' => $telegramUser->username(),
                    'is_premium' => $telegramUser->isPremium(),
                ]);

                return $existingUser;
            }

            return User::create([
                'first_name' => $telegramUser->firstName(),
                'last_name' => $telegramUser->lastName(),
                'username' => $telegramUser->username(),
                'chat_id' => $telegramUser->id(),
                'is_trial' => false,
                'trial_expired' => null,
                'is_premium' => $telegramUser->isPremium(),
                'is_free' => false,
            ]);
        } catch (\Exception $e) {
            Log::error('Ошибка создания пользователя Telegram: ' . $e->getMessage(), [
                'chat_id' => $telegramUser->id(),
                'username' => $telegramUser->username(),
            ]);

            throw $e;
        }
    }
}
