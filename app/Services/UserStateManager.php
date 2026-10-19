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
use Carbon\CarbonInterface;

final readonly class UserStateManager
{
    /**
     * Принимает зависимости для работы UserStateManager.
     *
     * @param RemnawaveApi $remnawaveApi
     */
    public function __construct(private RemnawaveApi $remnawaveApi) {}

    /**
     * Получает актуальное состояние пользователя из Remnawave.
     *
     * @param User $user
     *
     * @return UserResponse
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getRemoteUser(User $user): UserResponse
    {
        if ($user->remnawave_user_id !== null) {
            return $this->remnawaveApi->users()->getUserById($user->remnawave_user_id)->response;
        }

        return $this->remnawaveApi
            ->users()
            ->getUserByUsername($user->username)
            ->response;
    }

    /**
     * Синхронизирует tag в Remnawave и локальной БД.
     *
     * @param User $user
     *
     * @return UserTags
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    public function sync(User $user): UserTags
    {
        return $this->syncFromRemote($user, $this->getRemoteUser($user));
    }

    /**
     * Синхронизирует tag с уже полученным состоянием Remnawave.
     *
     * Remnawave изменяется первым, чтобы ошибка API не создавала
     * заведомую рассинхронизацию в локальной БД.
     *
     * @param User $user
     * @param UserResponse $remoteUser
     *
     * @return UserTags
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    public function syncFromRemote(User $user, UserResponse $remoteUser): UserTags
    {
        $targetTag = $this->resolveLocalTag($user->tags, $remoteUser);

        $this->updateRemoteTag($remoteUser, $targetTag);
        $this->updateLocalTag($user, $targetTag);

        return $targetTag;
    }

    /**
     * Фиксирует успешно созданный trial в локальном lifecycle.
     *
     * @param User $user
     *
     * @return void
     */
    public function markTrial(User $user): void
    {
        $this->updateLocalTag($user, UserTags::Trial);
    }

    /**
     * Активирует подписку до подтверждённой Remnawave даты.
     *
     * Remnawave изменяется первым. Если локальная запись завершится ошибкой,
     * повторная обработка безопасно повторит тот же remote update.
     *
     * @param User $user
     * @param UserResponse $remoteUser
     * @param CarbonInterface $expiresAt
     *
     * @return void
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    public function activateSubscriptionUntil(
        User $user,
        UserResponse $remoteUser,
        CarbonInterface $expiresAt,
    ): void {
        $targetTag = $this->resolveActivationTag($user->tags, $remoteUser);

        $this->remnawaveApi->users()->update(new UpdateUserRequestDto(
            id: $remoteUser->id,
            status: $remoteUser->status === UserStatus::Expired
                ? UserStatus::Active
                : null,
            expireAt: $expiresAt->copy()->utc()->format('Y-m-d\TH:i:s.v\Z'),
            tag: $targetTag->value,
        ));

        $this->updateLocalTag($user, $targetTag);
    }

    /**
     * Отключает доступ из-за превышения лимита устройств без изменения local tag.
     *
     * @param UserResponse $remoteUser
     *
     * @return UserResponse
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    public function disableForDeviceLimit(UserResponse $remoteUser): UserResponse
    {
        if ($remoteUser->status === UserStatus::Disabled) {
            return $remoteUser;
        }

        return $this->remnawaveApi->users()->disableUser($remoteUser->id)->response;
    }

    /**
     * Восстанавливает доступ после устранения превышения без изменения local tag.
     *
     * @param UserResponse $remoteUser
     *
     * @return UserResponse
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    public function enableAfterDeviceLimitRecovery(UserResponse $remoteUser): UserResponse
    {
        if ($remoteUser->status !== UserStatus::Disabled) {
            return $remoteUser;
        }

        return $this->remnawaveApi->users()->enableUser($remoteUser->id)->response;
    }

    /**
     * Определяет local tag по подтверждённому состоянию Remnawave.
     *
     * @param UserTags $currentTag
     * @param UserResponse $remoteUser
     *
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
     * Определяет tag после успешной оплаты с защитой FAMILY / FRIENDS.
     *
     * @param UserTags $currentTag
     * @param UserResponse $remoteUser
     *
     * @return UserTags
     */
    private function resolveActivationTag(UserTags $currentTag, UserResponse $remoteUser): UserTags
    {
        if ($this->isSpecialTag($currentTag)) {
            return $currentTag;
        }

        $remoteTag = UserTags::tryFrom((string) $remoteUser->tag);

        return $remoteTag !== null && $this->isSpecialTag($remoteTag)
            ? $remoteTag
            : UserTags::Active;
    }

    /**
     * Обновляет tag в Remnawave только при фактическом расхождении.
     *
     * @param UserResponse $remoteUser
     * @param UserTags $targetTag
     *
     * @return void
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    private function updateRemoteTag(UserResponse $remoteUser, UserTags $targetTag): void
    {
        if ($remoteUser->tag === $targetTag->value) {
            return;
        }

        $this->remnawaveApi->users()->update(new UpdateUserRequestDto(
            id: $remoteUser->id,
            tag: $targetTag->value,
        ));
    }

    /**
     * Обновляет local tag только при фактическом изменении.
     *
     * @param User $user
     * @param UserTags $targetTag
     *
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
     *
     * @return bool
     */
    private function isSpecialTag(UserTags $tag): bool
    {
        return $tag === UserTags::Family || $tag === UserTags::Friends;
    }
}
