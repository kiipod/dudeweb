<?php

declare(strict_types=1);

namespace App\Remnawave;

use App\Remnawave\DTO\LoginRequestDto;
use App\Remnawave\Exceptions\ApiException;
use App\Remnawave\Modules\AuthModule;
use App\Remnawave\Modules\SystemModule;
use App\Remnawave\Modules\UserModule;
use Illuminate\Http\Client\ConnectionException;

final class RemnawaveApi
{
    public AuthModule $auth;
    public UserModule $users;
    public SystemModule $system;

    protected string $baseUrl;
    protected ?string $token = null;

    /**
     * @param LoginRequestDto $loginDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function __construct(LoginRequestDto $loginDto)
    {
        $this->baseUrl = config('services.remnawave.api_url');

        // 1. Авторизация
        $auth = new AuthModule($this->baseUrl);
        $loginResponse = $auth->login($loginDto);

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
     * Альтернативный статический конструктор для удобства
     *
     * @param string $username
     * @param string $password
     * @return self
     * @throws ApiException
     * @throws ConnectionException
     */
    public static function create(string $username, string $password): self
    {
        $loginDto = new LoginRequestDto(
            username: $username,
            password: $password,
        );

        return new self($loginDto);
    }

    /**
     * @return string
     */
    public function token(): string
    {
        return $this->token;
    }
}
