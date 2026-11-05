<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use App\Payment\Exceptions\PaymentProcessingException;
use App\Remnawave\Exceptions\ApiException;
use App\Services\UserStateManager;
use App\Services\SubscriptionMutationLock;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

final readonly class SubscriptionExtender
{
    /**
     * Принимает зависимости для работы SubscriptionExtender.
     *
     * @param UserStateManager $userStateManager
     * @param SubscriptionMutationLock $subscriptionMutationLock
     */
    public function __construct(
        private UserStateManager $userStateManager,
        private SubscriptionMutationLock $subscriptionMutationLock,
    ) {}

    /**
     * Сериализует продление подписки и применяет сохранённую целевую дату.
     *
     * @param Payment $payment
     *
     * @return void
     *
     * @throws ApiException
     * @throws ConnectionException
     * @throws \Throwable
     */
    public function extend(Payment $payment): void
    {
        $this->subscriptionMutationLock->run(
            $payment->user,
            fn() => $this->extendLocked($payment),
        );
    }

    /**
     * Продлевает удалённую подписку под блокировкой пользователя.
     *
     * @param Payment $payment
     *
     * @return void
     *
     * @throws ApiException
     * @throws ConnectionException
     * @throws \Throwable
     */
    private function extendLocked(Payment $payment): void
    {
        $claimedToken = $payment->processing_token;
        $payment->refresh();
        if ($payment->processing_token !== $claimedToken) {
            throw new PaymentProcessingException('Payment processing claim was lost.');
        }
        if ($payment->subscription_applied_at !== null) {
            return;
        }
        $remoteUser = null;
        $newEnd = $payment->subscription_expires_at;

        if ($newEnd === null) {
            $remoteUser = $this->userStateManager->getRemoteUser($payment->user);
            $currentEnd = Carbon::parse($remoteUser->expireAt)->utc();
            $baseDate = $currentEnd->isFuture() ? $currentEnd : now();
            $newEnd = $baseDate->copy()->addMonthsNoOverflow($payment->months)->utc();

            $this->storeTarget($payment, $newEnd, $currentEnd);
        }

        $remoteUser ??= $this->userStateManager->getRemoteUser($payment->user);
        $remoteEnd = Carbon::parse($remoteUser->expireAt);
        if (
            !$remoteEnd->equalTo($newEnd)
            && ($payment->subscription_source_expires_at === null
                || !$remoteEnd->equalTo($payment->subscription_source_expires_at))
        ) {
            throw new PaymentProcessingException('Subscription expiration conflict; payment requires reconciliation.');
        }

        $this->userStateManager->activateSubscriptionUntil(
            $payment->user,
            $remoteUser,
            $newEnd,
        );
        DB::transaction(function () use ($payment): void {
            $claimed = Payment::query()->lockForUpdate()->findOrFail($payment->id);
            if ($claimed->processing_token !== $payment->processing_token) {
                throw new PaymentProcessingException('Payment processing claim was lost.');
            }
            $claimed->update(['subscription_applied_at' => now()]);
        });
    }

    /**
     * Сохраняет абсолютную целевую дату продления для безопасного повтора.
     *
     * @param Payment $claimedPayment
     * @param Carbon $newEnd
     * @param Carbon $sourceEnd
     *
     * @return void
     *
     * @throws \Throwable
     */
    private function storeTarget(Payment $claimedPayment, Carbon $newEnd, Carbon $sourceEnd): void
    {
        DB::transaction(function () use ($claimedPayment, $newEnd, $sourceEnd): void {
            $payment = Payment::query()->lockForUpdate()->findOrFail($claimedPayment->id);

            if ($payment->processing_token !== $claimedPayment->processing_token) {
                throw new PaymentProcessingException('Payment processing claim was lost.');
            }

            $payment->update(['subscription_expires_at' => $newEnd, 'subscription_source_expires_at' => $sourceEnd]);
            $claimedPayment->refresh();
        });
    }
}
