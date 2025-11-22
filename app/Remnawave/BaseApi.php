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

    /**
     * @param string $baseUrl
     * @param string|null $token
     */
    public function __construct(string $baseUrl, ?string $token = null)
    {
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->token = $token;
    }

    /**
     * @return PendingRequest
     */
    protected function client(): PendingRequest
    {
        $client = Http::baseUrl($this->baseUrl)->acceptJson();

        if ($this->token) {
            $client = $client->withToken($this->token);
        }

        return $client;
    }

    /**
     * Метод отвечает за обработку успешного ответа с преобразованием в DTO
     *
     * @param Response $response
     * @param string|null $dtoClass
     * @return array|mixed
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

        throw new ApiException(
            $response->json('message', 'Unknown API error'),
            $response->status(),
        );
    }

    /**
     * @param string $url
     * @param array $params
     * @return string
     */
    protected function buildUrl(string $url, array $params = []): string
    {
        if (empty($params)) {
            return $url;
        }

        foreach ($params as $key => $value) {
            $url = str_replace("{{$key}}", $value, $url);
        }

        return $url;
    }

    /**
     * Отправка GET запроса с DTO
     *
     * @param string $url
     * @param string|null $responseDtoClass
     * @param array $urlParams
     * @return mixed
     * @throws ApiException
     * @throws ConnectionException
     */
    protected function getWithDto(
        string $url,
        ?string $responseDtoClass = null,
        array $urlParams = [],
    ): mixed {
        $url = $this->buildUrl($url, $urlParams);
        $response = $this->client()->get($url);
        return $this->handle($response, $responseDtoClass);
    }

    /**
     * Отправка GET запроса с параметрами
     *
     * @param string $url
     * @param array $queryParams
     * @param string|null $responseDtoClass
     * @param array $urlParams
     * @return mixed
     * @throws ApiException
     * @throws ConnectionException
     */
    protected function getWithQueryParams(
        string $url,
        array $queryParams = [],
        ?string $responseDtoClass = null,
        array $urlParams = [],
    ): mixed {
        $url = $this->buildUrl($url, $urlParams);
        $response = $this->client()->get($url, $queryParams);
        return $this->handle($response, $responseDtoClass);
    }

    /**
     * Отправка POST запроса с DTO
     *
     * @param string $url
     * @param Dto|null $dto
     * @param string|null $responseDtoClass
     * @param array $urlParams
     * @return mixed
     * @throws ApiException
     * @throws ConnectionException
     */
    protected function postWithDto(
        string $url,
        ?Dto $dto = null,
        ?string $responseDtoClass = null,
        array $urlParams = [],
    ): mixed {
        $url = $this->buildUrl($url, $urlParams);
        $response = $this->client()->post($url, $dto->toArray());
        return $this->handle($response, $responseDtoClass);
    }

    /**
     * Отправка PATCH запроса с DTO
     *
     * @param string $url
     * @param Dto|null $dto
     * @param string|null $responseDtoClass
     * @param array $urlParams
     * @return mixed
     * @throws ApiException
     * @throws ConnectionException
     */
    protected function patchWithDto(
        string $url,
        ?Dto $dto = null,
        ?string $responseDtoClass = null,
        array $urlParams = [],
    ): mixed {
        $url = $this->buildUrl($url, $urlParams);
        $response = $this->client()->patch($url, $dto->toArray());
        return $this->handle($response, $responseDtoClass);
    }

    /**
     * Отправка PUT запроса с DTO
     *
     * @param string $url
     * @param Dto|null $dto
     * @param string|null $responseDtoClass
     * @param array $urlParams
     * @return mixed
     * @throws ApiException
     * @throws ConnectionException
     */
    protected function putWithDto(
        string $url,
        ?Dto $dto = null,
        ?string $responseDtoClass = null,
        array $urlParams = [],
    ): mixed {
        $url = $this->buildUrl($url, $urlParams);
        $response = $this->client()->put($url, $dto->toArray());
        return $this->handle($response, $responseDtoClass);
    }

    /**
     * Отправка DELETE запроса с DTO
     *
     * @param string $url
     * @param string|null $responseDtoClass
     * @param array $urlParams
     * @param array $data
     * @return mixed
     * @throws ApiException
     * @throws ConnectionException
     */
    protected function deleteWithDto(
        string $url,
        ?string $responseDtoClass = null,
        array $urlParams = [],
        array $data = [],
    ): mixed {
        $url = $this->buildUrl($url, $urlParams);
        $response = $this->client()->delete($url, $data);
        return $this->handle($response, $responseDtoClass);
    }
}
