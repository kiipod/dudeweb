<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Payment;
use App\Models\ReferralReward;
use App\Models\User;
use App\Payment\Enums\PaymentStatus;
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
        if (!$payer->referrer_user_id || $payer->id === $payer->referrer_user_id) {
            return;
        }

        $bonusDays = (int) (config("referral.bonus_days.{$payment->months}") ?? 0);

        if ($bonusDays <= 0) {
            return;
        }

        DB::transaction(function () use ($payer, $payment, $bonusDays): void {
            $lockedPayer = User::query()->lockForUpdate()->findOrFail($payer->id);
            $hasEarlierSuccessfulPayment = Payment::query()
                ->where('user_id', $lockedPayer->id)
                ->whereKeyNot($payment->id)
                ->where('status', PaymentStatus::Succeeded)
                ->exists();

            if (
                $hasEarlierSuccessfulPayment
                || ReferralReward::query()->where('payment_id', $payment->id)->exists()
            ) {
                return;
            }

            $referrer = User::query()
                ->lockForUpdate()
                ->findOrFail($lockedPayer->referrer_user_id);
            $currentEnd = $referrer->trial_expired?->isFuture()
                ? $referrer->trial_expired->copy()
                : now();

            $referrer->update(['trial_expired' => $currentEnd->addDays($bonusDays)]);

            ReferralReward::query()->create([
                'referrer_user_id' => $referrer->id,
                'referred_user_id' => $lockedPayer->id,
                'payment_id' => $payment->id,
                'days_added' => $bonusDays,
            ]);
        });
    }
}
