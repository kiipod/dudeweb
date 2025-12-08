<?php

declare(strict_types=1);

namespace App\Remnawave\Handlers;

use App\Remnawave\BaseApi;
use App\Remnawave\DTO\LoginRequestDto;
use App\Remnawave\DTO\LoginResponseDto;
use App\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;

final class AuthHandlers extends BaseApi
{
    /**
     * Метод отвечает за авторизацию администратора в панеле
     *
     * @param LoginRequestDto $loginDto
     * @return LoginResponseDto
     * @throws ApiException
     * @throws ConnectionException
     */
    public function login(LoginRequestDto $loginDto): LoginResponseDto
    {
        return $this->postWithDto(
            url: '/api/auth/login',
            dto: $loginDto,
            responseDtoClass: LoginResponseDto::class,
        );
    }
}
