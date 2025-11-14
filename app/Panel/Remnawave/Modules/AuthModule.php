<?php

declare(strict_types=1);

namespace App\Panel\Remnawave\Modules;

use App\Panel\Remnawave\BaseApi;
use App\Panel\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;

final class AuthModule extends BaseApi
{
    /**
     * Метод отвечает за авторизацию администратора в панеле
     *
     * @param string $username
     * @param string $password
     * @return array
     * @throws ApiException
     * @throws ConnectionException
     */
    public function login(string $username, string $password): array
    {
        $response = $this->client()->post('/api/auth/login', [
            'username' => $username,
            'password' => $password,
        ]);

        return $this->handle($response);
    }
}
