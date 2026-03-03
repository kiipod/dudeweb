<?php

declare(strict_types=1);

namespace App\Remnawave;

use App\Remnawave\DTO\LoginRequestDto;
use App\Remnawave\Exceptions\ApiException;
use App\Remnawave\Handlers\ApiTokenHandler;
use App\Remnawave\Handlers\AuthHandler;
use App\Remnawave\Handlers\HostHandler;
use App\Remnawave\Handlers\HwidHandler;
use App\Remnawave\Handlers\InternalSquadHandler;
use App\Remnawave\Handlers\NodesHandler;
use App\Remnawave\Handlers\SystemHandler;
use App\Remnawave\Handlers\UserHandler;
use Illuminate\Http\Client\ConnectionException;

final class RemnawaveApi
{
    private string $baseUrl;
    private string $apiToken;
    private ?string $accessToken = null;

    public function __construct()
    {
        $this->baseUrl = config('services.remnawave.api_url');
        $this->apiToken = config('services.remnawave.token');
    }

    /**
     * @return string
     * @throws ApiException
     * @throws ConnectionException
     */
    private function getAccessToken(): string
    {
        if ($this->accessToken === null) {
            $this->accessToken = $this->login();
        }

        return $this->accessToken;
    }

    /**
     * Получение access_token администратора через авторизацию
     *
     * @return string
     * @throws ApiException
     * @throws ConnectionException
     */
    private function login(): string
    {
        $username = config('services.remnawave.username');
        $password = config('services.remnawave.password');

        $loginDto = new LoginRequestDto(
            username: $username,
            password: $password,
        );

        $response = $this->auth()->login($loginDto);

        if (empty($response->response->accessToken)) {
            throw new \RuntimeException('Failed to obtain admin access token');
        }

        return $response->response->accessToken;
    }


    /**
     * Модель аутентификации
     *
     * @return AuthHandler
     */
    public function auth(): AuthHandler
    {
        return new AuthHandler($this->baseUrl, $this->apiToken);
    }

    /**
     * Модуль API токенов
     *
     * @return ApiTokenHandler
     * @throws ApiException
     * @throws ConnectionException
     */
    public function apiToken(): ApiTokenHandler
    {
        $accessToken = $this->getAccessToken();
        return new ApiTokenHandler($this->baseUrl, $accessToken);
    }

    /**
     * Модуль пользователей
     *
     * @return UserHandler
     */
    public function users(): UserHandler
    {
        return new UserHandler($this->baseUrl, $this->apiToken);
    }

    /**
     * Модуль HWID
     *
     * @return HwidHandler
     */
    public function hwid(): HwidHandler
    {
        return new HwidHandler($this->baseUrl, $this->apiToken);
    }

    /**
     * Модуль нод
     *
     * @return NodesHandler
     */
    public function nodes(): NodesHandler
    {
        return new NodesHandler($this->baseUrl, $this->apiToken);
    }

    /**
     * Модуль хостов
     *
     * @return HostHandler
     */
    public function hosts(): HostHandler
    {
        return new HostHandler($this->baseUrl, $this->apiToken);
    }

    /**
     * Модуль для внутренних сквадов
     *
     * @return InternalSquadHandler
     */
    public function internalSquad(): InternalSquadHandler
    {
        return new InternalSquadHandler($this->baseUrl, $this->apiToken);
    }

    /**
     * Модуль системы
     *
     * @return SystemHandler
     */
    public function system(): SystemHandler
    {
        return new SystemHandler($this->baseUrl, $this->apiToken);
    }
}
