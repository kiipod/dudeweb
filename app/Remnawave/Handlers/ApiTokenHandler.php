<?php

declare(strict_types=1);

namespace App\Remnawave\Handlers;

use App\Remnawave\BaseApi;
use App\Remnawave\DTO\DeleteApiTokenResponseDto;
use App\Remnawave\DTO\GetAllApiTokensResponseDto;
use App\Remnawave\DTO\Response\CreateApiTokenResponse;
use App\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;

final class ApiTokenHandler extends BaseApi
{
    /**
     * Создание нового API токена в панеле
     *
     * @param string $tokenName
     * @return CreateApiTokenResponse
     * @throws ApiException
     * @throws ConnectionException
     */
    public function create(string $tokenName): CreateApiTokenResponse
    {
        return $this->postWithDto(
            url: '/api/tokens',
            headers: [
                'X-Remnawave-Client-Type' => 'browser',
            ],
            responseDtoClass: CreateApiTokenResponse::class,
            urlParams: ['tokenName' => $tokenName],
        );
    }

    /**
     * Получение всех API токенов из панели
     *
     * @return GetAllApiTokensResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getAll(): GetAllApiTokensResponseDto
    {
        return $this->getWithDto(
            url: '/api/tokens',
            headers: [
                'X-Remnawave-Client-Type' => 'browser',
            ],
            responseDtoClass: GetAllApiTokensResponseDto::class,
        );
    }

    /**
     * Удаление API токена по uuid
     *
     * @param string $uuid
     * @return DeleteApiTokenResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function delete(string $uuid): DeleteApiTokenResponseDto
    {
        return $this->deleteWithDto(
            url: '/api/tokens/{uuid}',
            headers: [
                'X-Remnawave-Client-Type' => 'browser',
            ],
            responseDtoClass: DeleteApiTokenResponseDto::class,
            urlParams: ['uuid' => $uuid],
        );
    }
}
