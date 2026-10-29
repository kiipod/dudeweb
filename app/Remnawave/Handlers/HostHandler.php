<?php

declare(strict_types=1);

namespace App\Remnawave\Handlers;

use App\Remnawave\BaseApi;
use App\Remnawave\DTO\GetAllHostsResponseDto;
use App\Remnawave\DTO\HostResponseDto;
use App\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;

final class HostHandler extends BaseApi
{
    /**
     * Метод получает информацию на все существующие хосты
     *
     * @return GetAllHostsResponseDto
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getAllHosts(): GetAllHostsResponseDto
    {
        return $this->getWithDto(
            url: '/api/hosts',
            responseDtoClass: GetAllHostsResponseDto::class,
        );
    }

    /**
     * Метод получает информацию о хосте по uuid
     *
     * @param string $uuid
     *
     * @return HostResponseDto
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getHostByUuid(string $uuid): HostResponseDto
    {
        return $this->getWithDto(
            url: '/api/hosts/{uuid}',
            responseDtoClass: HostResponseDto::class,
            urlParams: ['uuid' => $uuid],
        );
    }
}
