<?php

declare(strict_types=1);

namespace App\Panel\Remnawave;

use App\Panel\Remnawave\Exceptions\ApiException;
use App\Panel\Remnawave\Modules\AuthModule;
use App\Panel\Remnawave\Modules\SystemModule;
use App\Panel\Remnawave\Modules\UserModule;
use Illuminate\Http\Client\ConnectionException;

final class RemnawaveApi
{
    public AuthModule $auth;
    public UserModule $users;
    public SystemModule $system;

    protected string $baseUrl;
    protected ?string $token = null;

    /**
     * @param string $username
     * @param string $password
     * @throws ApiException
     * @throws ConnectionException
     */
    public function __construct(string $username, string $password)
    {
        $this->baseUrl = config('remnawave.api_url');

        // 1. Авторизация
        $auth = new AuthModule($this->baseUrl);
        $loginResponse = $auth->login($username, $password);

        if (!isset($loginResponse['accessToken'])) {
            throw new ApiException('Login failed: token not received');
        }

        $this->token = $loginResponse['accessToken'];

        // 2. Инициализация модулей
        $this->auth   = new AuthModule($this->baseUrl, $this->token);
        $this->users  = new UserModule($this->baseUrl, $this->token);
        $this->system = new SystemModule($this->baseUrl, $this->token);
    }

    /**
     * @return string
     */
    public function token(): string
    {
        return $this->token;
    }
}
