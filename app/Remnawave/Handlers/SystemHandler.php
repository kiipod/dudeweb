<?php

declare(strict_types=1);

namespace App\Remnawave\Handlers;

use App\Remnawave\BaseApi;
use App\Remnawave\DTO\GetStatsResponseDto;
use App\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;

final class SystemHandler extends BaseApi
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
}
