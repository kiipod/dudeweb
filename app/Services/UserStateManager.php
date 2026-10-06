<?php

declare(strict_types=1);

namespace App\Services;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\User;
use App\Remnawave\DTO\Response\UserResponse;
use App\Remnawave\DTO\UpdateUserRequestDto;
use App\Remnawave\Enums\UserStatus;
use App\Remnawave\Exceptions\ApiException;
use App\Remnawave\RemnawaveApi;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Carbon;

final readonly class UserStateManager
{
    /**
     * @param RemnawaveApi $remnawaveApi
     */
    public function __construct(private RemnawaveApi $remnawaveApi) {}

    /**
     * Получает актуальное состояние пользователя из Remnawave.
     *
     * @param User $user
     * @return UserResponse
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getRemoteUser(User $user): UserResponse
    {
        return $this->remnawaveApi
            ->users()
            ->getUserByUsername($user->username)
            ->response;
    }

    /**
     * Синхронизирует локальный tag с актуальным состоянием Remnawave.
     *
     * @param User $user
     * @return UserTags
     * @throws ApiException
     * @throws ConnectionException
     */
    public function sync(User $user): UserTags
    {
        return $this->syncFromRemote($user, $this->getRemoteUser($user));
    }

    /**
     * Синхронизирует локальный tag с уже полученным состоянием Remnawave.
     *
     * @param User $user
     * @param UserResponse $remoteUser
     * @return UserTags
     */
    public function syncFromRemote(User $user, UserResponse $remoteUser): UserTags
    {
        $targetTag = $this->resolveLocalTag($user->tags, $remoteUser);

        $this->updateLocalTag($user, $targetTag);

        return $targetTag;
    }

    /**
     * Фиксирует успешно созданный trial в локальном lifecycle.
     *
     * @param User $user
     * @return void
     */
    public function markTrial(User $user): void
    {
        $this->updateLocalTag($user, UserTags::Trial);
    }

    /**
     * Активирует продлённую подписку после подтверждённой оплаты.
     *
     * Remnawave изменяется первым. Если локальная запись завершится ошибкой,
     * повторная обработка безопасно повторит тот же remote update.
     *
     * @param User $user
     * @param UserResponse $remoteUser
     * @param Carbon $expiresAt
     * @return void
     * @throws ApiException
     * @throws ConnectionException
     */
    public function activateAfterPayment(
        User $user,
        UserResponse $remoteUser,
        Carbon $expiresAt,
    ): void {
        $specialTag = $this->isSpecialTag($user->tags);

        $this->remnawaveApi->users()->update(new UpdateUserRequestDto(
            id: $remoteUser->id,
            status: $remoteUser->status === UserStatus::Expired
                ? UserStatus::Active
                : null,
            expireAt: $expiresAt->copy()->utc()->format('Y-m-d\TH:i:s.v\Z'),
            tag: $specialTag ? null : UserTags::Active->value,
        ));

        $this->updateLocalTag($user, UserTags::Active);
    }

    /**
     * Определяет local tag по подтверждённому состоянию Remnawave.
     *
     * @param UserTags $currentTag
     * @param UserResponse $remoteUser
     * @return UserTags
     */
    private function resolveLocalTag(UserTags $currentTag, UserResponse $remoteUser): UserTags
    {
        if ($this->isSpecialTag($currentTag)) {
            return $currentTag;
        }

        $remoteTag = UserTags::tryFrom((string) $remoteUser->tag);

        if ($remoteTag === UserTags::Family || $remoteTag === UserTags::Friends) {
            return $remoteTag;
        }

        return match ($remoteUser->status) {
            UserStatus::Expired => UserTags::Inactive,
            UserStatus::Active => $remoteTag === UserTags::Trial
                ? UserTags::Trial
                : UserTags::Active,
            UserStatus::Limited, UserStatus::Disabled => $currentTag,
        };
    }

    /**
     * Обновляет local tag только при фактическом изменении.
     *
     * @param User $user
     * @param UserTags $targetTag
     * @return void
     */
    private function updateLocalTag(User $user, UserTags $targetTag): void
    {
        if ($this->isSpecialTag($user->tags) || $user->tags === $targetTag) {
            return;
        }

        $user->update(['tags' => $targetTag]);
    }

    /**
     * Проверяет, защищён ли local tag от обычного lifecycle.
     *
     * @param UserTags $tag
     * @return bool
     */
    private function isSpecialTag(UserTags $tag): bool
    {
        return $tag === UserTags::Family || $tag === UserTags::Friends;
    }
}
