<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\ReferralRewardStatus;
use App\Models\Payment;
use App\Models\ReferralReward;
use App\Payment\ReferralRewardNotifier;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

final readonly class ReferralRewardProcessor
{
    /**
     * @param UserStateManager $userStateManager
     * @param SubscriptionMutationLock $subscriptionMutationLock
     * @param ReferralRewardNotifier $notifier
     */
    public function __construct(
        private UserStateManager $userStateManager,
        private SubscriptionMutationLock $subscriptionMutationLock,
        private ReferralRewardNotifier $notifier,
    ) {}

    /**
     * Применяет реферальное вознаграждение, созданное для платежа.
     *
     * @param Payment $payment
     * @return void
     * @throws Throwable
     */
    public function processForPayment(Payment $payment): void
    {
        $reward = ReferralReward::query()
            ->whereBelongsTo($payment)
            ->first();

        if ($reward !== null) {
            $this->process($reward);
        }
    }

    /**
     * Обрабатывает ожидающие начисления и недоставленные уведомления.
     *
     * @return array{processed: int, applied: int, notified: int, conflicts: int, failed: int}
     */
    public function processDue(): array
    {
        $result = [
            'processed' => 0,
            'applied' => 0,
            'notified' => 0,
            'conflicts' => 0,
            'failed' => 0,
        ];

        $rewards = ReferralReward::query()
            ->where(function ($query): void {
                $query
                    ->where('status', ReferralRewardStatus::Pending->value)
                    ->orWhere(function ($query): void {
                        $query
                            ->where('status', ReferralRewardStatus::Applied->value)
                            ->whereNull('notified_at');
                    });
            })
            ->orderBy('id')
            ->lazyById(100);

        foreach ($rewards as $reward) {
            $result['processed']++;

            try {
                $processed = $this->process($reward);
                $result['applied'] += $processed['applied'] ? 1 : 0;
                $result['notified'] += $processed['notified'] ? 1 : 0;
                $result['conflicts'] += $processed['conflicted'] ? 1 : 0;
            } catch (Throwable $exception) {
                $result['failed']++;

                Log::error('Referral reward processing failed.', [
                    'referral_reward_id' => $reward->id,
                    'payment_id' => $reward->payment_id,
                    'exception' => $exception::class,
                    'code' => $exception->getCode(),
                ]);
            }
        }

        return $result;
    }

    /**
     * Применяет одно начисление и отправляет уведомление после подтверждения Remnawave.
     *
     * @param ReferralReward $reward
     * @return array{applied: bool, notified: bool, conflicted: bool}
     * @throws Throwable
     */
    public function process(ReferralReward $reward): array
    {
        $wasApplied = $reward->status === ReferralRewardStatus::Applied;
        $reward = $this->apply($reward);
        $notified = $reward->status === ReferralRewardStatus::Applied && $this->notifier->notify($reward);

        return [
            'applied' => !$wasApplied && $reward->status === ReferralRewardStatus::Applied,
            'notified' => $notified,
            'conflicted' => $reward->status === ReferralRewardStatus::Conflict,
        ];
    }

    /**
     * Применяет ожидающее начисление к актуальному состоянию Remnawave.
     *
     * @param ReferralReward $reward
     * @return ReferralReward
     * @throws Throwable
     */
    private function apply(ReferralReward $reward): ReferralReward
    {
        $reward->loadMissing('referrer');

        if ($reward->status !== ReferralRewardStatus::Pending) {
            return $reward->refresh();
        }

        try {
            return $this->subscriptionMutationLock->run(
                $reward->referrer,
                fn(): ReferralReward => $this->applyLocked($reward->id),
            );
        } catch (Throwable $exception) {
            $this->recordFailure($reward->id, $exception);

            throw $exception;
        }
    }

    /**
     * Применяет начисление под блокировкой изменений подписки пользователя.
     *
     * @param int $rewardId
     * @return ReferralReward
     * @throws Throwable
     */
    private function applyLocked(int $rewardId): ReferralReward
    {
        $reward = ReferralReward::query()
            ->with('referrer')
            ->findOrFail($rewardId);

        if ($reward->status !== ReferralRewardStatus::Pending) {
            return $reward;
        }

        $reward->increment('attempts');
        $reward->update([
            'last_attempted_at' => now(),
            'last_error' => null,
        ]);

        $remoteUser = $this->userStateManager->getRemoteUser($reward->referrer);
        $remoteExpiresAt = CarbonImmutable::parse($remoteUser->expireAt)->utc();
        $sourceExpiresAt = $reward->remote_expires_at_before;
        $targetExpiresAt = $reward->target_expires_at;

        if ($targetExpiresAt === null) {
            $sourceExpiresAt = $remoteExpiresAt;
            $baseDate = $remoteExpiresAt->isFuture()
                ? $remoteExpiresAt
                : CarbonImmutable::instance(now())->utc();
            $targetExpiresAt = $baseDate->addDays($reward->days_added);

            $reward->update([
                'remote_expires_at_before' => $sourceExpiresAt,
                'target_expires_at' => $targetExpiresAt,
            ]);
        }

        if ($sourceExpiresAt === null) {
            return $this->markConflict($reward, $remoteExpiresAt);
        }

        if (
            !$remoteExpiresAt->equalTo($sourceExpiresAt)
            && !$remoteExpiresAt->equalTo($targetExpiresAt)
        ) {
            return $this->markConflict($reward, $remoteExpiresAt);
        }

        $this->userStateManager->activateSubscriptionUntil(
            $reward->referrer,
            $remoteUser,
            $targetExpiresAt,
        );

        $reward->update([
            'status' => ReferralRewardStatus::Applied,
            'applied_at' => now(),
            'last_error' => null,
        ]);

        return $reward->refresh();
    }

    /**
     * Переводит начисление в конфликт, не перезаписывая новую remote-дату.
     *
     * @param ReferralReward $reward
     * @param CarbonImmutable $remoteExpiresAt
     * @return ReferralReward
     */
    private function markConflict(
        ReferralReward $reward,
        CarbonImmutable $remoteExpiresAt,
    ): ReferralReward {
        $reward->update([
            'status' => ReferralRewardStatus::Conflict,
            'last_error' => sprintf(
                'Remote expiration conflict: expected %s or %s, received %s.',
                $reward->remote_expires_at_before?->toISOString(),
                $reward->target_expires_at?->toISOString(),
                $remoteExpiresAt->toISOString(),
            ),
        ]);

        return $reward->refresh();
    }

    /**
     * Сохраняет безопасное описание ошибки для следующей попытки.
     *
     * @param int $rewardId
     * @param Throwable $exception
     * @return void
     */
    private function recordFailure(int $rewardId, Throwable $exception): void
    {
        ReferralReward::query()
            ->whereKey($rewardId)
            ->where('status', ReferralRewardStatus::Pending->value)
            ->update([
                'last_attempted_at' => now(),
                'last_error' => Str::limit(
                    sprintf('%s: %s', $exception::class, $exception->getMessage()),
                    2000,
                    '',
                ),
            ]);
    }
}
