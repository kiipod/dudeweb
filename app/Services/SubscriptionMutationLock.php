<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Closure;
use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Support\Facades\Cache;

final class SubscriptionMutationLock
{
    /**
     * Сериализует изменения подписки одного пользователя.
     *
     * @param User $user
     * @param Closure $callback
     *
     * @return mixed
     *
     * @throws LockTimeoutException
     * @throws \Throwable
     */
    public function run(User $user, Closure $callback): mixed
    {
        return Cache::lock("subscription-mutation:user:{$user->id}", 60)
            ->block(10, $callback);
    }
}
