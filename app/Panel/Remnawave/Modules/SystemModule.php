<?php

declare(strict_types=1);

namespace App\Panel\Remnawave\Modules;

use App\Panel\Remnawave\BaseApi;
use App\Panel\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;

final class SystemModule extends BaseApi
{
    /**
     * @return array
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getStats(): array
    {
        $response = $this->client()->get("/api/system/stats");
        return $this->handle($response);
    }

    /**
     * @return array
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getBandwidthStats(): array
    {
        $response = $this->client()->get('/api/system/bandwidth-stats');
        return $this->handle($response);
    }

    /**
     * @return array
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getRemnawaveHealth(): array
    {
        $response = $this->client()->get('/api/system/health');
        return $this->handle($response);
    }

    /**
     * @param array $data
     * @return array
     * @throws ApiException
     * @throws ConnectionException
     */
    public function encryptHappCryptoLink(array $data): array
    {
        $response = $this->client()->post('/api/system/encrypt-happ-crypto-link', $data);
        return $this->handle($response);
    }
}
