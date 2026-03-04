<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Payment;
use App\Models\ReferralReward;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final class ReferralService
{
    /**
     * @param User $payer
     * @param Payment $payment
     * @return void
     * @throws \Throwable
     */
    public function handlePayment(User $payer, Payment $payment): void
    {
        // 1. Нет реферера — выходим
        if (!$payer->referrer_user_id) {
            return;
        }

        // 2. Самореферал запрещён
        if ($payer->id === $payer->referrer_user_id) {
            return;
        }

        $referrer = $payer->referrer;

        // 3. Проверка на повторное начисление
        $alreadyRewarded = ReferralReward::where('payment_id', $payment->id)->exists();

        if ($alreadyRewarded) {
            return;
        }

        // 4. Определяем бонус
        $months = $payment->months; // допустим у платежа есть поле months
        $bonusDays = config("referral.bonus_days.$months") ?? 0;

        if ($bonusDays <= 0) {
            return;
        }

        DB::transaction(function () use ($referrer, $payer, $payment, $bonusDays) {
            // Начисляем дни (пример — продление подписки)
            $referrer->trial_expired = optional($referrer->trial_expired)
                ->addDays($bonusDays) ?? now()->addDays($bonusDays);

            $referrer->save();

            ReferralReward::create([
                'referrer_user_id' => $referrer->id,
                'referred_user_id' => $payer->id,
                'payment_id'       => $payment->id,
                'days_added'       => $bonusDays,
            ]);
        });
    }
}
