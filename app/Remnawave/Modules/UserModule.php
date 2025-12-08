<?php

declare(strict_types=1);

namespace App\Remnawave\Modules;

use App\Remnawave\BaseApi;
use App\Remnawave\DTO\CreateUserRequestDto;
use App\Remnawave\DTO\CreateUserResponseDto;
use App\Remnawave\DTO\DeleteUserResponseDto;
use App\Remnawave\DTO\GetSubscriptionByUuidResponseDto;
use App\Remnawave\DTO\UpdateUserRequestDto;
use App\Remnawave\DTO\UpdateUserResponseDto;
use App\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;

final class UserModule extends BaseApi
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
     * Метод получает информацию по подписке пользователя по UUID
     *     * @param string $uuid
     * @return GetSubscriptionByUuidResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getSubscriptionByUuid(string $uuid): GetSubscriptionByUuidResponseDto
    {
        return $this->getWithDto(
            url: '/api/subscriptions/by-uuid/{uuid}',
            responseDtoClass: GetSubscriptionByUuidResponseDto::class,
            urlParams: ['uuid' => $uuid],
        );
    }
}
