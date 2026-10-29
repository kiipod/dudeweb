<?php

declare(strict_types=1);

namespace App\Remnawave\Handlers;

use App\Remnawave\BaseApi;
use App\Remnawave\DTO\CreateApiTokenRequestDto;
use App\Remnawave\DTO\CreateApiTokenResponseDto;
use App\Remnawave\DTO\GetAllApiTokensResponseDto;
use App\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;

final class ApiTokenHandler extends BaseApi
{
    /**
     * Создание нового API токена в панеле
     *
     * @param CreateApiTokenRequestDto $request
     *
     * @return CreateApiTokenResponseDto
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    public function create(CreateApiTokenRequestDto $request): CreateApiTokenResponseDto
    {
        return $this->postWithDto(
            url: '/api/tokens',
            dto: $request,
            responseDtoClass: CreateApiTokenResponseDto::class,
        );
    }

    /**
     * Получение всех API токенов из панели
     *
     * @return GetAllApiTokensResponseDto
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getAll(): GetAllApiTokensResponseDto
    {
        return $this->getWithDto(
            url: '/api/tokens',
            responseDtoClass: GetAllApiTokensResponseDto::class,
        );
    }

    /**
     * Удаление API токена по uuid
     *
     * @param string $uuid
     *
     * @return void
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    public function delete(string $uuid): void
    {
        $this->deleteWithoutBody(
            url: '/api/tokens/{uuid}',
            urlParams: ['uuid' => $uuid],
        );
    }
}
