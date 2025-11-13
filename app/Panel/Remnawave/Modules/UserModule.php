<?php

declare(strict_types=1);

namespace App\Panel\Remnawave\Modules;

use App\Panel\Remnawave\BaseApi;
use App\Panel\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;

final class UserModule extends BaseApi
{
    /**
     * Метод отвечает за создание нового пользователя в панеле
     *
     * @param array $data
     * @return array
     * @throws ApiException
     * @throws ConnectionException
     */
    public function create(array $data): array
    {
        $response = $this->client()->post('/api/users', $data);
        return $this->handle($response);
    }

    /**
     * Метод отвечает за обновление данных пользователя по UUID или Username
     *
     * @param array $data
     * @return array
     * @throws ApiException
     * @throws ConnectionException
     */
    public function update(array $data): array
    {
        $response = $this->client()->patch('/api/users', $data);
        return $this->handle($response);
    }

    /**
     * Метод отвечает за удаление пользователя по UUID в панеле
     *
     * @param string $uuid
     * @return array
     * @throws ApiException
     * @throws ConnectionException
     */
    public function delete(string $uuid): array
    {
        $response = $this->client()->delete("/api/users/{$uuid}");
        return $this->handle($response);
    }

    /**
     * Метод получает информацию по подписке пользователя по UUID
     *
     * @param string $uuid
     * @return array
     * @throws ApiException
     * @throws ConnectionException
     */
    public function getSubscriptionByUuid(string $uuid): array
    {
        $response = $this->client()->get("/api/subscriptions/by-uuid/{$uuid}");
        return $this->handle($response);
    }
}
