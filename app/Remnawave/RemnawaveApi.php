<?php

declare(strict_types=1);

namespace App\Remnawave;

use App\Remnawave\Modules\AuthModule;
use App\Remnawave\Modules\SystemModule;
use App\Remnawave\Modules\UserModule;

final class RemnawaveApi
{
    private string $baseUrl;
    private string $apiToken;

    /**
     * @param string $apiToken
     */
    public function __construct(string $apiToken)
    {
        $this->baseUrl = config('services.remnawave.api_url');
        $this->apiToken = $apiToken;
    }

    /**
     * Получение API токена
     *
     * @return string|null
     */
    public function getApiToken(): ?string
    {
        return $this->apiToken;
    }

    /**
     * Проверка наличия токена
     *
     * @return bool
     */
    public function hasToken(): bool
    {
        return !empty($this->apiToken);
    }

    /**
     * @return AuthModule
     */
    public function auth(): AuthModule
    {
        return new AuthModule($this->baseUrl, $this->apiToken);
    }

    /**
     * @return UserModule
     */
    public function users(): UserModule
    {
        return new UserModule($this->baseUrl, $this->apiToken);
    }

    /**
     * @return SystemModule
     */
    public function system(): SystemModule
    {
        return new SystemModule($this->baseUrl, $this->apiToken);
    }
}
