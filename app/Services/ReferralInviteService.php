<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ReferralInvite;
use App\Models\User;
use Illuminate\Container\Attributes\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final readonly class ReferralInviteService
{
    /**
     * Принимает canonical Telegram username из конфигурации.
     *
     * @param string|null $botUsername
     */
    public function __construct(#[Config('services.telegram.bot_username')] private ?string $botUsername) {}

    /**
     * Возвращает стабильные приглашения без local ID, chat ID и remote ID в URL.
     *
     * @param User $user
     *
     * @return array{webInviteUrl: string|null, telegramInviteUrl: string|null}
     *
     * @throws \Throwable
     */
    public function links(User $user): array
    {
        $token = DB::transaction(function () use ($user): ?string {
            $owner = User::query()->lockForUpdate()->findOrFail($user->id);
            if ($owner->remnawave_user_id === null) {
                return null;
            }
            return ReferralInvite::query()->oldest('id')->firstOrCreate(
                ['remnawave_user_id' => $owner->remnawave_user_id],
                ['token' => Str::random(40)],
            )->token;
        });
        $bot = ltrim($this->botUsername ?? '', '@');
        return [
            'webInviteUrl' => $token === null ? null : route('referral.invite', ['token' => $token]),
            'telegramInviteUrl' => $token !== null && preg_match('/\A[A-Za-z0-9_]{5,32}\z/', $bot) === 1
                ? "https://t.me/{$bot}?start=ref_{$token}" : null,
        ];
    }

    /**
     * Разрешает opaque token через numeric remote identity и отклоняет self-referral.
     *
     * @param string|null $token
     * @param User|null $current
     *
     * @return User|null
     */
    public function resolve(?string $token, ?User $current = null): ?User
    {
        if (!is_string($token) || preg_match('/\A[A-Za-z0-9]{40}\z/', $token) !== 1) {
            return null;
        }
        $remote = ReferralInvite::query()->where('token', $token)->value('remnawave_user_id');
        $owner = $remote === null ? null : User::query()->where('remnawave_user_id', $remote)->first();
        if ($owner === null || $owner->id === $current?->id
            || ($current?->remnawave_user_id !== null && $owner->remnawave_user_id === $current->remnawave_user_id)) {
            return null;
        }
        return $owner;
    }

    /**
     * Назначает referrer только новому пользователю с первым валидным приглашением.
     *
     * @param User $user
     * @param string|null $token
     *
     * @return void
     *
     * @throws \Throwable
     */
    public function attributeNewUser(User $user, ?string $token): void
    {
        if (!$user->wasRecentlyCreated || $user->referrer_user_id !== null) {
            return;
        }
        $referrer = $this->resolve($token, $user);
        if ($referrer !== null) {
            $user->update(['referrer_user_id' => $referrer->id]);
        }
    }
}
