<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Remnawave\DTO\Response\UserResponse;
use Illuminate\Database\Eloquent\Collection;

final class RemoteUserMapping
{
    /**
     * Maps numeric identities first, retaining only compatible legacy fallbacks.
     *
     * @param list<UserResponse> $remoteUsers
     * @param list<string> $with
     *
     * @return Collection<int, User>
     */
    public function forPage(array $remoteUsers, array $with = []): Collection
    {
        if ($remoteUsers === []) {
            return new Collection();
        }
        $users = User::query()->with($with)->where(function ($query) use ($remoteUsers): void {
            $query->whereIn('remnawave_user_id', array_column($remoteUsers, 'id'))
                ->orWhereIn('chat_id', array_filter(array_column($remoteUsers, 'telegramId')))
                ->orWhereIn('username', array_column($remoteUsers, 'username'));
        })->get();
        $numeric = $users->whereNotNull('remnawave_user_id')->keyBy('remnawave_user_id');
        $chat = $users->whereNotNull('chat_id')->keyBy('chat_id');
        $names = $users->whereNotNull('username')->keyBy('username');
        $mapped = new Collection();
        foreach ($remoteUsers as $remote) {
            $user = $numeric->get($remote->id)
                ?? ($remote->telegramId !== null ? $chat->get($remote->telegramId) : $names->get($remote->username));
            if ($user !== null && ($user->remnawave_user_id === null || $user->remnawave_user_id === $remote->id)) {
                $mapped->put($remote->id, $user);
            }
        }
        return $mapped;
    }
}
