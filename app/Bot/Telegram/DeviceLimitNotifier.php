<?php

declare(strict_types=1);

namespace App\Bot\Telegram;

use App\Models\TelegramBot;
use App\Models\User;
use DefStudio\Telegraph\Keyboard\Button;
use DefStudio\Telegraph\Keyboard\Keyboard;
use Illuminate\Support\Facades\DB;
use Throwable;

final readonly class DeviceLimitNotifier
{
    /**
     * Отправляет одно уведомление для текущего превышения лимита устройств.
     *
     * @param User $user
     * @param int $deviceCount
     * @param int $deviceLimit
     * @return bool
     * @throws Throwable
     */
    public function notify(User $user, int $deviceCount, int $deviceLimit): bool
    {
        return DB::transaction(function () use ($user, $deviceCount, $deviceLimit): bool {
            $lockedUser = User::query()->lockForUpdate()->findOrFail($user->id);

            if (
                $lockedUser->device_limit_exceeded_at === null
                || $lockedUser->device_limit_notification_sent_at !== null
            ) {
                return false;
            }

            $bot = TelegramBot::query()->firstOrFail();
            $chat = $bot->chats()
                ->where('chat_id', $lockedUser->chat_id)
                ->firstOrFail();

            $chat
                ->markdown(
                    "⚠️ Превышен лимит устройств.\n\n"
                    . "Подключено: *{$deviceCount}*. Разрешено тарифом: *{$deviceLimit}*.\n\n"
                    . 'Удалите лишние устройства, чтобы восстановить доступ.',
                )
                ->keyboard(
                    Keyboard::make()->buttons([
                        Button::make('Управление устройствами')->action('devices'),
                    ]),
                )
                ->send();

            $lockedUser->update(['device_limit_notification_sent_at' => now()]);

            return true;
        });
    }
}
