<?php

declare(strict_types=1);

namespace App\Remnawave\Modules;

use App\Remnawave\BaseApi;
use App\Remnawave\DTO\GetBandwidthStatsResponseDto;
use App\Remnawave\DTO\GetRemnawaveHealthResponseDto;
use App\Remnawave\DTO\GetStatsResponseDto;
use App\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;

final class SystemModule extends BaseApi
{
    /**
     * Метод возвращает статистику потребляемой мощности сервера
     *
     * @return GetStatsResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getStats(): GetStatsResponseDto
    {
        return $this->getWithDto(
            url: '/api/system/stats',
            responseDtoClass: GetStatsResponseDto::class,
        );
    }

    /**
     * Метод возвращает статистику пропускной способности сервера
     *
     * @return GetBandwidthStatsResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getBandwidthStats(): GetBandwidthStatsResponseDto
    {
        return $this->getWithDto(
            '/api/system/stats/bandwidth',
            GetBandwidthStatsResponseDto::class,
        );
    }

    /**
     * Метод возвращает состояние панели Remnawave
     *
     * @return GetRemnawaveHealthResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getRemnawaveHealth(): GetRemnawaveHealthResponseDto
    {
        return $this->getWithDto(
            url: '/api/system/health',
            responseDtoClass: GetRemnawaveHealthResponseDto::class,
        );
    }
}
