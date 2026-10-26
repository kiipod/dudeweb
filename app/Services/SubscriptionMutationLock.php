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
            ->block(10, function () use ($user, $callback): mixed {
                $fresh = $user->fresh();
                if ($fresh === null || $fresh->telegram_merge_id !== null) {
                    throw new \DomainException('Account subscriptions are being merged; retry the operation later.');
                }
                $user->setRawAttributes($fresh->getAttributes(), true);
                return $callback();
            });
    }

    /**
     * Захватывает обе subscription locks в стабильном порядке для durable merge.
     *
     * @param list<int> $userIds
     * @param Closure $callback
     *
     * @return mixed
     *
     * @throws \Throwable
     */
    public function merge(array $userIds, Closure $callback): mixed
    {
        $userIds = array_values(array_unique($userIds));
        sort($userIds);
        foreach (array_reverse($userIds) as $id) {
            $next = $callback;
            $callback = fn(): mixed => Cache::lock("subscription-mutation:user:{$id}", 120)->block(10, $next);
        }
        return $callback();
    }
}
