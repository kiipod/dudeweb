<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

final class AccountConnectionPolicy
{
    /**
     * Разрешает чтение подключения только подтверждённому web-пользователю.
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
     * Допускает управление устройствами только при установленной remote identity.
     *
     * @param User $user
     *
     * @return bool
     */
    public function deleteDevice(User $user): bool
    {
        return $this->view($user) && $user->remnawave_user_id !== null;
    }
}
