<?php

declare(strict_types=1);

namespace App\Payment;

use App\Enums\ReferralRewardStatus;
use App\Models\ReferralReward;
use App\Models\TelegramBot;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class ReferralRewardNotifier
{
    /**
     * @param ReferralReward $reward
     * @return bool
     * @throws Throwable
     */
    public function notify(ReferralReward $reward): bool
    {
        try {
            return DB::transaction(function () use ($reward): bool {
                $lockedReward = ReferralReward::query()
                    ->with('referrer')
                    ->lockForUpdate()
                    ->findOrFail($reward->id);

                if (
                    $lockedReward->status !== ReferralRewardStatus::Applied
                    || $lockedReward->notified_at !== null
                ) {
                    return false;
                }

                $bot = TelegramBot::query()->firstOrFail();
                $chat = $bot->chats()
                    ->where('chat_id', $lockedReward->referrer->chat_id)
                    ->firstOrFail();

                $chat
                    ->markdown(
                        "🎁 Ваш друг оплатил подписку.\n\n"
                        . "Вам начислено вознаграждение: *{$lockedReward->days_added} дней*.",
                    )
                    ->send();

                $lockedReward->update(['notified_at' => now()]);

                return true;
            });
        } catch (Throwable $exception) {
            Log::error('Telegram referral reward notification failed.', [
                'payment_id' => $reward->payment_id,
                'referral_reward_id' => $reward->id,
                'exception' => $exception::class,
                'code' => $exception->getCode(),
            ]);

            throw $exception;
        }
    }
}
