<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

final class AccountReferralPolicy
{
    /**
     * Разрешает чтение own referral overview/terms подтверждённому web account.
     *
     * @param User $user
     *
     * @return bool
     */
    public function view(User $user): bool
    {
        return $user->email !== null && $user->hasVerifiedEmail();
    }
}
