<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\ReferralRewardStatus;
use App\Models\Payment;
use App\Models\ReferralBonus;
use App\Models\ReferralReward;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final class ReferralService
{
    /**
     * Создаёт вознаграждение пригласившему пользователю за подходящий оплаченный период.
     *
     * @param User $payer
     * @param Payment $payment
     *
     * @return void
     *
     * @throws \Throwable
     */
    public function handlePayment(User $payer, Payment $payment): void
    {
        if (!$payer->referrer_user_id || $payer->id === $payer->referrer_user_id) {
            return;
        }

        $bonusDays = (int) (ReferralBonus::query()
            ->where('paid_months', $payment->months)
            ->latest('updated_at')
            ->latest('id')
            ->value('bonus_days') ?? 0);

        if ($bonusDays <= 0) {
            return;
        }

        DB::transaction(function () use ($payer, $payment, $bonusDays): void {
            $lockedPayer = User::query()->lockForUpdate()->findOrFail($payer->id);

            if (
                $lockedPayer->referrer_user_id === null
                || $lockedPayer->id === $lockedPayer->referrer_user_id
                || ReferralReward::query()->where('payment_id', $payment->id)->exists()
            ) {
                return;
            }

            $referrer = User::query()
                ->lockForUpdate()
                ->findOrFail($lockedPayer->referrer_user_id);

            ReferralReward::query()->create([
                'referrer_user_id' => $referrer->id,
                'referred_user_id' => $lockedPayer->id,
                'payment_id' => $payment->id,
                'days_added' => $bonusDays,
                'status' => ReferralRewardStatus::Pending,
            ]);
        });
    }
}
