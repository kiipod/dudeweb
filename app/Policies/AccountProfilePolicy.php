<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

final class AccountProfilePolicy
{
    /**
     * Разрешает профиль только владельцу подтверждённой web identity.
     *
     * @param User $user
     *
     * @return bool
     */
    public function view(User $user): bool
    {
        return $user->email !== null && $user->hasVerifiedEmail();
    }

    /**
     * Разрешает изменение собственных данных, без customer ID из request.
     *
     * @param User $user
     *
     * @return bool
     */
    public function update(User $user): bool
    {
        return $this->view($user);
    }

    /**
     * Разрешает security actions только существующему password account.
     *
     * @param User $user
     *
     * @return bool
     */
    public function secure(User $user): bool
    {
        return $this->view($user) && $user->password !== null;
    }
}
