<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ReferralBonus;

final class ReferralRules
{
    public const int FRIEND_DISCOUNT_PERCENT = 30;

    /**
     * Выбирает последнюю изменённую настройку с deterministic ID tie-breaker.
     *
     * @param int $months
     *
     * @return int
     */
    public function bonusDays(int $months): int
    {
        return (int) (ReferralBonus::query()->where('paid_months', $months)
            ->latest('updated_at')->latest('id')->value('bonus_days') ?? 0);
    }

    /**
     * Возвращает live правила с тем же preference, что используется при оплате.
     *
     * @return list<array{months: int, days: int}>
     */
    public function matrix(): array
    {
        return ReferralBonus::query()->select(['paid_months', 'bonus_days'])
            ->latest('updated_at')->latest('id')->get()->unique('paid_months')
            ->sortBy('paid_months')->map(fn(ReferralBonus $bonus): array => [
                'months' => (int) $bonus->paid_months, 'days' => (int) $bonus->bonus_days,
            ])->values()->all();
    }
}
