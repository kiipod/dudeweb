<?php

declare(strict_types=1);

namespace App\Remnawave;

use App\Remnawave\DTO\Dto;
use App\Remnawave\Exceptions\ApiException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

abstract class BaseApi
{
    protected string $baseUrl;
    protected ?string $token;

    private ?int $responseTimeout = null;

    private ?int $connectionTimeout = null;

    /**
     * Сохраняет базовый адрес Remnawave и необязательный токен авторизации.
     *
     * @param string $baseUrl
     * @param string|null $token
     */
    public function __construct(string $baseUrl, ?string $token = null)
    {
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->token = $token;
    }

    /**
     * Создаёт копию handler с ограничениями времени только для текущего чтения.
     *
     * @param int $responseTimeout
     * @param int $connectionTimeout
     *
     * @return static
     */
    public function withTimeouts(int $responseTimeout, int $connectionTimeout): static
    {
        $handler = clone($this);
        $handler->responseTimeout = $responseTimeout;
        $handler->connectionTimeout = $connectionTimeout;

        return $handler;
    }

    /**
     * Создаёт HTTP-клиент с базовым адресом, авторизацией и таймаутами Remnawave.
     *
     * @return PendingRequest
     */
    protected function client(): PendingRequest
    {
        $client = Http::baseUrl($this->baseUrl)->acceptJson();

        if ($this->token) {
            $client = $client->withToken($this->token);
        }

        if ($this->responseTimeout !== null) {
            $client = $client->timeout($this->responseTimeout);
        }

        if ($this->connectionTimeout !== null) {
            $client = $client->connectTimeout($this->connectionTimeout);
        }

        return $client;
    }

    /**
     * Метод отвечает за обработку успешного ответа с преобразованием в DTO
     *
     * @param Response $response
     * @param string|null $dtoClass
     *
     * @return mixed
     *
     * @throws ApiException
     */
    protected function handle(Response $response, ?string $dtoClass = null): mixed
    {
        if ($response->successful()) {
            $data = $response->json();

            // Если передан класс DTO, преобразуем данные
            if ($dtoClass && class_exists($dtoClass) && is_subclass_of($dtoClass, Dto::class)) {
                return $dtoClass::fromArray($data);
            }

            return $data;
        }

        $retryAfter = $response->header('Retry-After');
        $seconds = null;
        if (is_string($retryAfter) && ctype_digit(trim($retryAfter))) {
            $seconds = max(1, (int) $retryAfter);
        } elseif (is_string($retryAfter) && ($date = strtotime($retryAfter)) !== false) {
            $seconds = max(1, $date - now()->getTimestamp());
        }
        throw new ApiException(
            $response->json('message', 'Unknown API error'),
            $response->status(),
            retryAfterSeconds: $seconds,
        );
    }

    /**
     * Подставляет параметры пути с корректным кодированием сегментов URL.
     *
     * @param string $url
     * @param array $params
     *
     * @return string
     */
    protected function buildUrl(string $url, array $params = []): string
    {
        if (empty($params)) {
            return $url;
        }

        foreach ($params as $key => $value) {
            $url = str_replace("{{$key}}", rawurlencode((string) $value), $url);
        }

        return $url;
    }

    /**
     * Отправка GET запроса с DTO
     *
     * @param string $url
     * @param array $headers
     * @param string|null $responseDtoClass
     * @param array $urlParams
     *
     * @return mixed
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    protected function getWithDto(
        string $url,
        array $headers = [],
        ?string $responseDtoClass = null,
        array $urlParams = [],
    ): mixed {
        $url = $this->buildUrl($url, $urlParams);
        $client = $this->client();

        // Добавляем дополнительные заголовки
        if (!empty($headers)) {
            $client = $client->withHeaders($headers);
        }

        $response = $client->get($url);
        return $this->handle($response, $responseDtoClass);
    }

    /**
     * Отправка GET запроса с параметрами
     *
     * @param string $url
     * @param array $headers
     * @param array $queryParams
     * @param string|null $responseDtoClass
     * @param array $urlParams
     *
     * @return mixed
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    protected function getWithQueryParams(
        string $url,
        array $headers = [],
        array $queryParams = [],
        ?string $responseDtoClass = null,
        array $urlParams = [],
    ): mixed {
        $url = $this->buildUrl($url, $urlParams);
        $client = $this->client();

        // Добавляем дополнительные заголовки
        if (!empty($headers)) {
            $client = $client->withHeaders($headers);
        }

        $response = $client->get($url, $queryParams);
        return $this->handle($response, $responseDtoClass);
    }

    /**
     * Отправка POST запроса с DTO
     *
     * @param string $url
     * @param array $headers
     * @param Dto|null $dto
     * @param string|null $responseDtoClass
     * @param array $urlParams
     *
     * @return mixed
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    protected function postWithDto(
        string $url,
        array $headers = [],
        ?Dto $dto = null,
        ?string $responseDtoClass = null,
        array $urlParams = [],
    ): mixed {
        $url = $this->buildUrl($url, $urlParams);
        $client = $this->client();

        // Добавляем дополнительные заголовки
        if (!empty($headers)) {
            $client = $client->withHeaders($headers);
        }

        $response = $client->post($url, $dto?->toArray() ?? []);
        return $this->handle($response, $responseDtoClass);
    }

    /**
     * Отправка POST запроса без тела.
     *
     * @param string $url
     * @param array $headers
     * @param string|null $responseDtoClass
     * @param array $urlParams
     *
     * @return mixed
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    protected function postWithoutBody(
        string $url,
        array $headers = [],
        ?string $responseDtoClass = null,
        array $urlParams = [],
    ): mixed {
        $url = $this->buildUrl($url, $urlParams);
        $client = $this->client();

        if (!empty($headers)) {
            $client = $client->withHeaders($headers);
        }

        $response = $client->send('POST', $url);
        return $this->handle($response, $responseDtoClass);
    }

    /**
     * Отправка PATCH запроса с DTO
     *
     * @param string $url
     * @param array $headers
     * @param Dto|null $dto
     * @param string|null $responseDtoClass
     * @param array $urlParams
     *
     * @return mixed
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    protected function patchWithDto(
        string $url,
        array $headers = [],
        ?Dto $dto = null,
        ?string $responseDtoClass = null,
        array $urlParams = [],
    ): mixed {
        $url = $this->buildUrl($url, $urlParams);
        $client = $this->client();

        // Добавляем дополнительные заголовки
        if (!empty($headers)) {
            $client = $client->withHeaders($headers);
        }

        $response = $client->patch($url, $dto->toArray());
        return $this->handle($response, $responseDtoClass);
    }

    /**
     * Отправка PUT запроса с DTO
     *
     * @param string $url
     * @param array $headers
     * @param Dto|null $dto
     * @param string|null $responseDtoClass
     * @param array $urlParams
     *
     * @return mixed
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    protected function putWithDto(
        string $url,
        array $headers = [],
        ?Dto $dto = null,
        ?string $responseDtoClass = null,
        array $urlParams = [],
    ): mixed {
        $url = $this->buildUrl($url, $urlParams);
        $client = $this->client();

        // Добавляем дополнительные заголовки
        if (!empty($headers)) {
            $client = $client->withHeaders($headers);
        }

        $response = $client->put($url, $dto->toArray());
        return $this->handle($response, $responseDtoClass);
    }

    /**
     * Отправка DELETE запроса с DTO
     *
     * @param string $url
     * @param array $headers
     * @param string|null $responseDtoClass
     * @param array $urlParams
     * @param array $data
     *
     * @return mixed
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    protected function deleteWithDto(
        string $url,
        array $headers = [],
        ?string $responseDtoClass = null,
        array $urlParams = [],
        array $data = [],
    ): mixed {
        $url = $this->buildUrl($url, $urlParams);
        $client = $this->client();

        // Добавляем дополнительные заголовки
        if (!empty($headers)) {
            $client = $client->withHeaders($headers);
        }

        $response = $client->delete($url, $data);
        return $this->handle($response, $responseDtoClass);
    }

    /**
     * Отправка DELETE запроса без тела.
     *
     * @param string $url
     * @param array $headers
     * @param array $urlParams
     *
     * @return mixed
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    protected function deleteWithoutBody(
        string $url,
        array $headers = [],
        array $urlParams = [],
    ): mixed {
        $url = $this->buildUrl($url, $urlParams);
        $client = $this->client();

        if (!empty($headers)) {
            $client = $client->withHeaders($headers);
        }

        $response = $client->send('DELETE', $url);
        return $this->handle($response);
    }
}
