<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use App\Models\ReferralReward;
use App\Models\TelegramBot;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class ReferralRewardNotifier
{
    /**
     * @param Payment $payment
     * @return void
     * @throws Throwable
     */
    public function notify(Payment $payment): void
    {
        try {
            DB::transaction(function () use ($payment): void {
                $reward = ReferralReward::query()
                    ->with('referrer')
                    ->whereBelongsTo($payment)
                    ->lockForUpdate()
                    ->first();

                if ($reward === null || $reward->notified_at !== null) {
                    return;
                }

                $bot = TelegramBot::query()->firstOrFail();
                $chat = $bot->chats()
                    ->where('chat_id', $reward->referrer->chat_id)
                    ->firstOrFail();

                $chat
                    ->markdown(
                        "🎁 Ваш друг оплатил подписку.\n\n"
                        . "Вам начислено вознаграждение: *{$reward->days_added} дней*.",
                    )
                    ->send();

                $reward->update(['notified_at' => now()]);
            });
        } catch (Throwable $exception) {
            Log::error('Telegram referral reward notification failed.', [
                'payment_id' => $payment->id,
                'exception' => $exception::class,
                'code' => $exception->getCode(),
            ]);

            throw $exception;
        }
    }
}
