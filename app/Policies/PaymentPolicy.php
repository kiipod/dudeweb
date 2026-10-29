<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;
use App\Payment\Enums\PaymentSource;
use App\Payment\Enums\PaymentStatus;
use App\Payment\Enums\PaymentCancellationReason;

final class PaymentPolicy
{
    /**
     * Разрешает web-покупки только подтверждённому email-аккаунту.
     *
     * @param User $user
     *
     * @return bool
     */
    public function create(User $user): bool
    {
        return $user->email !== null && $user->hasVerifiedEmail();
    }

    /**
     * Проверяет владельца без использования return token как авторизации.
     *
     * @param User $user
     * @param Payment $payment
     *
     * @return bool
     */
    public function view(User $user, Payment $payment): bool
    {
        return $this->create($user) && $payment->user_id === $user->id;
    }

    /**
     * Повторная попытка допустима только для отменённого web-платежа владельца.
     *
     * @param User $user
     * @param Payment $payment
     *
     * @return bool
     */
    public function retry(User $user, Payment $payment): bool
    {
        return $this->view($user, $payment)
            && $payment->source === PaymentSource::Web
            && $payment->status === PaymentStatus::Canceled
            && data_get($payment->metadata, 'cancellation_details.reason') !== PaymentCancellationReason::CanceledByMerchant->value;
    }
}
