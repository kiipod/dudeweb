<?php

declare(strict_types=1);

namespace App\Bot\Telegram;

use App\Models\TelegramBot;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class SubscriptionExpirationNotifier
{
    /**
     * @param User $user
     * @param CarbonImmutable $expiresAt
     * @return bool
     * @throws Throwable
     */
    public function notify(User $user, CarbonImmutable $expiresAt): bool
    {
        return DB::transaction(function () use ($user, $expiresAt): bool {
            $lockedUser = User::query()->lockForUpdate()->findOrFail($user->id);

            if ($lockedUser->subscription_reminder_sent_for?->equalTo($expiresAt)) {
                return false;
            }

            $bot = TelegramBot::query()->firstOrFail();
            $chat = $bot->chats()
                ->where('chat_id', $lockedUser->chat_id)
                ->firstOrFail();

            $chat
                ->markdown(
                    "⏳ Ваша подписка скоро закончится.\n\n"
                    . 'Не забудьте продлить её.',
                )
                ->send();

            $lockedUser->update(['subscription_reminder_sent_for' => $expiresAt]);

            return true;
        });
    }
}
