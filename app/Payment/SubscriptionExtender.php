<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use App\Payment\Exceptions\PaymentProcessingException;
use App\Remnawave\DTO\UpdateUserRequestDto;
use App\Remnawave\Exceptions\ApiException;
use App\Remnawave\RemnawaveApi;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

final readonly class SubscriptionExtender
{
    /**
     * @param RemnawaveApi $remnawaveApi
     */
    public function __construct(private RemnawaveApi $remnawaveApi) {}

    /**
     * @param Payment $payment
     * @return void
     * @throws ApiException
     * @throws ConnectionException
     * @throws \Throwable
     */
    public function extend(Payment $payment): void
    {
        $remoteUser = null;
        $newEnd = $payment->subscription_expires_at;

        if ($newEnd === null) {
            $remoteUser = $this->remnawaveApi
                ->users()
                ->getUserByUsername($payment->user->username)
                ->response;
            $currentEnd = Carbon::parse($remoteUser->expireAt);
            $baseDate = $currentEnd->isFuture() ? $currentEnd : now();
            $newEnd = $baseDate->copy()->addMonthsNoOverflow($payment->months);

            $this->storeTarget($payment, $newEnd);
        }

        $remoteUser ??= $this->remnawaveApi
            ->users()
            ->getUserByUsername($payment->user->username)
            ->response;

        $this->remnawaveApi->users()->update(new UpdateUserRequestDto(
            id: $remoteUser->id,
            expireAt: $newEnd->copy()->utc()->format('Y-m-d\TH:i:s.v\Z'),
        ));
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
