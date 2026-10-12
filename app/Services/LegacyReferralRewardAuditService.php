<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\ReferralRewardStatus;
use App\Models\ReferralReward;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class LegacyReferralRewardAuditService
{
    /**
     * @param UserStateManager $userStateManager
     */
    public function __construct(private UserStateManager $userStateManager) {}

    /**
     * Формирует read-only отчёт по историческим начислениям.
     *
     * @return array{rows: list<array<string, int|string|null>>, failed: int}
     */
    public function audit(): array
    {
        $groups = ReferralReward::query()
            ->selectRaw('referrer_user_id, COUNT(*) AS rewards_count, SUM(days_added) AS bonus_days')
            ->with('referrer')
            ->where('status', ReferralRewardStatus::Legacy->value)
            ->groupBy('referrer_user_id')
            ->orderBy('referrer_user_id')
            ->get();
        $rows = [];
        $failed = 0;

        foreach ($groups as $group) {
            $referrer = $group->referrer;
            $bonusDays = (int) $group->getAttribute('bonus_days');

            try {
                $remoteUser = $this->userStateManager->getRemoteUser($referrer);
                $remoteExpiresAt = CarbonImmutable::parse($remoteUser->expireAt)->utc();
                $baseDate = $remoteExpiresAt->isFuture()
                    ? $remoteExpiresAt
                    : CarbonImmutable::instance(now())->utc();

                $rows[] = [
                    'referrer_id' => $referrer->id,
                    'username' => $referrer->username,
                    'rewards' => (int) $group->getAttribute('rewards_count'),
                    'bonus_days' => $bonusDays,
                    'legacy_local_expires_at' => $referrer->trial_expired?->toISOString(),
                    'remote_expires_at' => $remoteExpiresAt->toISOString(),
                    'proposed_expires_at' => $baseDate->addDays($bonusDays)->toISOString(),
                    'error' => null,
                ];
            } catch (Throwable $exception) {
                $failed++;
                $rows[] = [
                    'referrer_id' => $referrer->id,
                    'username' => $referrer->username,
                    'rewards' => (int) $group->getAttribute('rewards_count'),
                    'bonus_days' => $bonusDays,
                    'legacy_local_expires_at' => $referrer->trial_expired?->toISOString(),
                    'remote_expires_at' => null,
                    'proposed_expires_at' => null,
                    'error' => $exception::class,
                ];

                Log::error('Legacy referral reward audit failed.', [
                    'referrer_user_id' => $referrer->id,
                    'exception' => $exception::class,
                    'code' => $exception->getCode(),
                ]);
            }
        }

        return ['rows' => $rows, 'failed' => $failed];
    }
}
