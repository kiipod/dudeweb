<?php

declare(strict_types=1);

namespace App\Services\Account;

use App\Enums\ReferralRewardStatus;
use App\Models\User;
use App\Services\ReferralInviteService;
use App\Services\ReferralRules;

final readonly class AccountReferralData
{
    /**
     * Принимает общий invite resolver и canonical referral rules.
     *
     * @param ReferralInviteService $invites
     * @param ReferralRules $rules
     */
    public function __construct(private ReferralInviteService $invites, private ReferralRules $rules) {}

    /**
     * Считает owner-only показатели на БД без гидратации друзей и rewards.
     *
     * @param User $user
     *
     * @return array<string, mixed>
     *
     * @throws \Throwable
     */
    public function overview(User $user): array
    {
        $metrics = User::query()->select('id')->whereKey($user->id)->withCount('referrals')
            ->withSum(['receivedReferralRewards as applied_days' => fn($query) => $query->where('status', ReferralRewardStatus::Applied)], 'days_added')
            ->firstOrFail();
        return [...$this->invites->links($user), 'metrics' => [
            'invitedCount' => (int) $metrics->referrals_count,
            'bonusDays' => (int) $metrics->applied_days,
        ]];
    }

    /**
     * Готовит read-only условия; неполные правила не заменяются значениями из Pen.
     *
     * @return array<string, mixed>
     *
     * @throws \JsonException
     */
    public function terms(): array
    {
        $matrix = $this->rules->matrix();
        $periods = array_column($matrix, 'months');
        $available = array_diff([1, 3, 6, 12], $periods) === []
            && !array_any($matrix, fn(array $row): bool => $row['days'] <= 0 || $row['months'] <= 0);
        $discount = ReferralRules::FRIEND_DISCOUNT_PERCENT;
        return [
            'termsAvailable' => $available,
            'friendDiscountPercent' => $available ? $discount : null,
            'rewardMatrix' => $available ? $matrix : [],
            'contentVersion' => $available ? 'referral-v1-' . hash('sha256', json_encode([$discount, $matrix], JSON_THROW_ON_ERROR)) : null,
        ];
    }
}
