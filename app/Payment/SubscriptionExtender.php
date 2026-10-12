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
     * @param UserStateManager $userStateManager
     * @param SubscriptionMutationLock $subscriptionMutationLock
     */
    public function __construct(
        private UserStateManager $userStateManager,
        private SubscriptionMutationLock $subscriptionMutationLock,
    ) {}

    /**
     * @param Payment $payment
     * @return void
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
     * @param Payment $payment
     * @return void
     * @throws ApiException
     * @throws ConnectionException
     * @throws \Throwable
     */
    private function extendLocked(Payment $payment): void
    {
        $remoteUser = null;
        $newEnd = $payment->subscription_expires_at;

        if ($newEnd === null) {
            $remoteUser = $this->userStateManager->getRemoteUser($payment->user);
            $currentEnd = Carbon::parse($remoteUser->expireAt);
            $baseDate = $currentEnd->isFuture() ? $currentEnd : now();
            $newEnd = $baseDate->copy()->addMonthsNoOverflow($payment->months);

            $this->storeTarget($payment, $newEnd);
        }

        $remoteUser ??= $this->userStateManager->getRemoteUser($payment->user);

        $this->userStateManager->activateSubscriptionUntil(
            $payment->user,
            $remoteUser,
            $newEnd,
        );
    }

    /**
     * @param Payment $claimedPayment
     * @param Carbon $newEnd
     * @return void
     * @throws \Throwable
     */
    private function storeTarget(Payment $claimedPayment, Carbon $newEnd): void
    {
        DB::transaction(function () use ($claimedPayment, $newEnd): void {
            $payment = Payment::query()->lockForUpdate()->findOrFail($claimedPayment->id);

            if ($payment->processing_token !== $claimedPayment->processing_token) {
                throw new PaymentProcessingException('Payment processing claim was lost.');
            }

            $payment->update(['subscription_expires_at' => $newEnd]);
            $claimedPayment->setAttribute('subscription_expires_at', $newEnd);
        });
    }
}
