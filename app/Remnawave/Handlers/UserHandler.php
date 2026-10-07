<?php

declare(strict_types=1);

namespace App\Remnawave\Handlers;

use App\Remnawave\BaseApi;
use App\Remnawave\DTO\CreateUserRequestDto;
use App\Remnawave\DTO\CreateUserResponseDto;
use App\Remnawave\DTO\GetSubscriptionByUsernameResponseDto;
use App\Remnawave\DTO\GetUserResponseDto;
use App\Remnawave\DTO\GetUsersStreamResponseDto;
use App\Remnawave\DTO\UpdateUserRequestDto;
use App\Remnawave\DTO\UpdateUserResponseDto;
use App\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;

final class UserHandler extends BaseApi
{
    /**
     * Метод отвечает за создание нового пользователя в панеле
     *
     * @param CreateUserRequestDto $createUserDto
     * @return CreateUserResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function create(CreateUserRequestDto $createUserDto): CreateUserResponseDto
    {
        return $this->postWithDto(
            url: '/api/users',
            dto: $createUserDto,
            responseDtoClass: CreateUserResponseDto::class,
        );
    }

    /**
     * Метод отвечает за обновление данных пользователя по UUID или Username
     *
     * @param UpdateUserRequestDto $updateUserDto
     * @return UpdateUserResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function update(UpdateUserRequestDto $updateUserDto): UpdateUserResponseDto
    {
        return $this->patchWithDto(
            url: '/api/users',
            dto: $updateUserDto,
            responseDtoClass: UpdateUserResponseDto::class,
        );
    }

    /**
     * Метод отвечает за удаление пользователя по ID в панели
     *
     * @param int $userId
     * @return void
     * @throws ApiException
     * @throws ConnectionException
     */
    public function delete(int $userId): void
    {
        $this->deleteWithoutBody(
            url: '/api/users/{userId}',
            urlParams: ['userId' => $userId],
        );
    }

    /**
     * Метод получает пользователя по username
     *
     * @param string $username
     * @return GetUserResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getUserByUsername(string $username): GetUserResponseDto
    {
        return $this->getWithDto(
            url: '/api/users/by-username/{username}',
            responseDtoClass: GetUserResponseDto::class,
            urlParams: ['username' => $username],
        );
    }

    /**
     * Получает пользователей через cursor pagination.
     *
     * @param string|null $cursor
     * @param int $size
     * @return GetUsersStreamResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getUsersStream(?string $cursor = null, int $size = 250): GetUsersStreamResponseDto
    {
        $query = ['size' => $size];

        if ($cursor !== null) {
            $query['cursor'] = $cursor;
        }

        return $this->getWithQueryParams(
            url: '/api/users/stream',
            queryParams: $query,
            responseDtoClass: GetUsersStreamResponseDto::class,
        );
    }

    /**
     * Метод блокирует пользователя
     *
     * @param int $userId
     * @return GetUserResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function disableUser(int $userId): GetUserResponseDto
    {
        return $this->postWithoutBody(
            url: '/api/users/{userId}/actions/disable',
            responseDtoClass: GetUserResponseDto::class,
            urlParams: ['userId' => $userId],
        );
    }

    /**
     * Метод разблокирует пользователя
     *
     * @param int $userId
     * @return GetUserResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function enableUser(int $userId): GetUserResponseDto
    {
        return $this->postWithoutBody(
            url: '/api/users/{userId}/actions/enable',
            responseDtoClass: GetUserResponseDto::class,
            urlParams: ['userId' => $userId],
        );
    }

    /**
     * Метод получает информацию по подписке пользователя по username
     *
     * @param string $username
     * @return GetSubscriptionByUsernameResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getSubscriptionByUsername(string $username): GetSubscriptionByUsernameResponseDto
    {
        return $this->getWithDto(
            url: '/api/subscriptions/by-username/{username}',
            responseDtoClass: GetSubscriptionByUsernameResponseDto::class,
            urlParams: ['username' => $username],
        );
    }
}
