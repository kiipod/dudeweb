<?php

declare(strict_types=1);

namespace App\Services\Profile;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\User;
use App\Remnawave\DTO\Response\UserResponse;
use App\Remnawave\Enums\UserStatus;
use App\Remnawave\RemnawaveApi;
use App\Services\UserStateManager;
use Carbon\CarbonImmutable;

final readonly class AccountMergePlan
{
    /**
     * Принимает существующий numeric/legacy remote resolver.
     *
     * @param UserStateManager $users
     * @param RemnawaveApi $api
     */
    public function __construct(private UserStateManager $users, private RemnawaveApi $api) {}

    /**
     * Сохраняет абсолютный target один раз, не складывая повторно дни при retry.
     *
     * @param User $web
     * @param User|null $telegram
     * @param int $chatId
     *
     * @return array<string, mixed>
     *
     * @throws \Throwable
     */
    public function build(User $web, ?User $telegram, int $chatId): array
    {
        $webRemote = $this->users->getRemoteUser($web);
        $telegramRemote = $telegram === null ? null : $this->telegramRemote($telegram, $chatId);
        if ($webRemote->id !== $web->remnawave_user_id
            || ($telegram?->remnawave_user_id !== null && $telegramRemote?->id !== $telegram->remnawave_user_id)
            || ($webRemote->telegramId !== null && $webRemote->telegramId !== $chatId)
            || ($telegramRemote !== null && $telegramRemote->telegramId !== $chatId)) {
            throw new \DomainException('Remote Telegram identity does not match the verified user.');
        }
        $survivor = $telegramRemote !== null && ($telegram->created_at->isBefore($web->created_at)
            || ($telegram->created_at->equalTo($web->created_at) && $telegram->id < $web->id)) ? $telegram : $web;
        // A legacy alias can resolve to the same remote record. Keep its existing
        // numeric mapping so FK-owned invite tokens never lose their owner.
        if ($telegramRemote?->id === $webRemote->id && $telegram?->remnawave_user_id === null) {
            $survivor = $web;
        }
        $remote = $survivor->id === $web->id ? $webRemote : $telegramRemote;
        $otherRemote = $survivor->id === $web->id ? $telegramRemote : $webRemote;
        if ($otherRemote?->id === $remote->id) {
            $otherRemote = null;
        }
        $now = CarbonImmutable::instance(now())->utc();
        $expires = CarbonImmutable::parse($remote->expireAt)->utc();
        $paidSeconds = 0;
        foreach (array_filter([$remote, $otherRemote]) as $item) {
            $end = CarbonImmutable::parse($item->expireAt)->utc();
            $expires = $expires->max($end);
            if ($item->tag === UserTags::Active->value) {
                $paidSeconds += max(0, $end->getTimestamp() - $now->getTimestamp());
            }
        }
        if ($paidSeconds > 0) {
            $expires = $expires->max($now->addSeconds($paidSeconds));
        }
        $special = in_array($remote->tag, [UserTags::Friends->value, UserTags::Family->value], true);
        return [
            'web_user_id' => $web->id,
            'survivor_user_id' => $survivor->id,
            'loser_user_id' => $telegram === null ? null : ($survivor->id === $web->id ? $telegram->id : $web->id),
            'survivor_remote_id' => $remote->id,
            'loser_remote_id' => $otherRemote?->id,
            'survivor_original_expires_at' => $remote->expireAt,
            'loser_original_expires_at' => $otherRemote?->expireAt,
            'target_expires_at' => $expires->toIso8601String(),
            'target_tag' => $special ? $remote->tag : ($paidSeconds > 0 ? UserTags::Active->value : $remote->tag),
            'target_status' => $remote->status === UserStatus::Expired && $expires->isAfter($now) ? UserStatus::Active->value : null,
            'email' => $web->email,
            'credentials_hash' => $this->credentialsHash($remote),
        ];
    }

    /**
     * Находит legacy подписку по подтверждённому Telegram ID, независимо от смены username.
     *
     * @param User $telegram
     * @param int $chatId
     *
     * @return UserResponse|null
     *
     * @throws \Throwable
     */
    private function telegramRemote(User $telegram, int $chatId): ?UserResponse
    {
        if ($telegram->remnawave_user_id !== null) {
            return $this->users->getRemoteUser($telegram);
        }
        $result = $this->api->users()->getUsersStream(size: 2, telegramId: $chatId)->response;
        if ($result->hasMore || count($result->users) > 1) {
            throw new \DomainException('Multiple remote subscriptions belong to the Telegram identity.');
        }
        return $result->users[0] ?? null;
    }

    /**
     * Проверяет сохранение исходной ссылки и credentials без записи secrets в plan.
     *
     * @param UserResponse $user
     *
     * @return string
     */
    public function credentialsHash(UserResponse $user): string
    {
        return hash('sha256', implode('|', [
            $user->shortUuid, $user->subscriptionUrl, $user->vlessUuid,
            $user->trojanPassword, $user->ssPassword,
        ]));
    }
}
