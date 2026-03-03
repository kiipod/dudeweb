<?php

declare(strict_types=1);

namespace App\Remnawave\Handlers;

use App\Remnawave\BaseApi;
use App\Remnawave\DTO\GetInternalSquadAccessibleNodesResponseDto;
use App\Remnawave\DTO\GetInternalSquadByUuidResponseDto;
use App\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;

final class InternalSquadHandler extends BaseApi
{
    /**
     * Метод получает связанные ноды по внутреннему скваду
     *
     * @param string $uuid
     * @return GetInternalSquadAccessibleNodesResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getInternalSquadAccessibleNodes(string $uuid): GetInternalSquadAccessibleNodesResponseDto
    {
        return $this->getWithDto(
            url: '/api/internal-squads/{uuid}/accessible-nodes',
            responseDtoClass: GetInternalSquadAccessibleNodesResponseDto::class,
            urlParams: ['uuid' => $uuid],
        );
    }

    /**
     * Метод получает информацию по внутреннему скваду
     *
     * @param string $uuid
     * @return GetInternalSquadByUuidResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getInternalSquadByUuid(string $uuid): GetInternalSquadByUuidResponseDto
    {
        return $this->getWithDto(
            url: '/api/internal-squads/{uuid}',
            responseDtoClass: GetInternalSquadByUuidResponseDto::class,
            urlParams: ['uuid' => $uuid],
        );
    }
}
