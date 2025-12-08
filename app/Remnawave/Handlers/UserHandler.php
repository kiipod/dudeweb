<?php

declare(strict_types=1);

namespace App\Remnawave\Handlers;

use App\Remnawave\BaseApi;
use App\Remnawave\DTO\CreateUserRequestDto;
use App\Remnawave\DTO\CreateUserResponseDto;
use App\Remnawave\DTO\DeleteUserResponseDto;
use App\Remnawave\DTO\GetUserResponseDto;
use App\Remnawave\DTO\GetSubscriptionByUuidResponseDto;
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
     * Метод отвечает за удаление пользователя по UUID в панеле
     *
     * @param string $uuid
     * @return DeleteUserResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function delete(string $uuid): DeleteUserResponseDto
    {
        return $this->deleteWithDto(
            url: '/api/users/{uuid}',
            responseDtoClass: DeleteUserResponseDto::class,
            urlParams: ['uuid' => $uuid],
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
     * Метод получает пользователя по telegram ID
     *
     * @param int $telegramId
     * @return GetUserResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getUserByTelegramId(int $telegramId): GetUserResponseDto
    {
        return $this->getWithDto(
            url: '/api/users/by-telegram-id/{telegramId}',
            responseDtoClass: GetUserResponseDto::class,
            urlParams: ['telegramId' => $telegramId],
        );
    }

    /**
     * Метод блокирует пользователя
     *
     * @param string $uuid
     * @return GetUserResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function disableUser(string $uuid): GetUserResponseDto
    {
        return $this->getWithDto(
            url: '/api/users/{uuid}/actions/disable',
            responseDtoClass: GetUserResponseDto::class,
            urlParams: ['uuid' => 'uuid'],
        );
    }

    /**
     * Метод разблокирует пользователя
     *
     * @param string $uuid
     * @return GetUserResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function enableUser(string $uuid): GetUserResponseDto
    {
        return $this->getWithDto(
            url: '/api/users/{uuid}/actions/enable',
            responseDtoClass: GetUserResponseDto::class,
            urlParams: ['uuid' => 'uuid'],
        );
    }

    /**
     * Метод получает информацию по подписке пользователя по username
     *
     * @param string $username
     * @return GetSubscriptionByUuidResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getSubscriptionByUsername(string $username): GetSubscriptionByUuidResponseDto
    {
        return $this->getWithDto(
            url: '/api/subscriptions/by-username/{username}',
            responseDtoClass: GetSubscriptionByUuidResponseDto::class,
            urlParams: ['username' => $username],
        );
    }
}
