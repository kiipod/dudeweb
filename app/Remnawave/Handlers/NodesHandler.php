<?php

declare(strict_types=1);

namespace App\Remnawave\Handlers;

use App\Remnawave\BaseApi;
use App\Remnawave\DTO\GetAllNodesResponseDto;
use App\Remnawave\DTO\GetNodesMetricsResponseDto;
use App\Remnawave\DTO\NodeResponseDto;
use App\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;

final class NodesHandler extends BaseApi
{
    /**
     * Метод получает информацию на все существующие ноды
     *
     * @return GetAllNodesResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getAllNodes(): GetAllNodesResponseDto
    {
        return $this->getWithDto(
            url: '/api/nodes',
            responseDtoClass: GetAllNodesResponseDto::class,
        );
    }

    /**
     * Метод получает информацию о ноде по uuid
     *
     * @param string $uuid
     * @return NodeResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getNodeByUuid(string $uuid): NodeResponseDto
    {
        return $this->getWithDto(
            url: '/api/nodes/{uuid}',
            responseDtoClass: NodeResponseDto::class,
            urlParams: ['uuid' => $uuid],
        );
    }

    /**
     * Метод получает метрики по нодам
     *
     * @return GetNodesMetricsResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getNodesMetrics(): GetNodesMetricsResponseDto
    {
        return $this->getWithDto(
            url: '/api/system/nodes/metrics',
            responseDtoClass: GetNodesMetricsResponseDto::class,
        );
    }
}
