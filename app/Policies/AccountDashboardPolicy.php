<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

final class AccountDashboardPolicy
{
    /**
     * Разрешает просмотр собственного кабинета подтверждённому web-пользователю.
     *
     * @param User $user
     *
     * @return bool
     */
    public function viewDashboard(User $user): bool
    {
        return $user->email !== null && $user->hasVerifiedEmail();
    }
}
