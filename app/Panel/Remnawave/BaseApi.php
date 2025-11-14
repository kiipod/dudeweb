<?php

declare(strict_types=1);

namespace App\Panel\Remnawave;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;
use App\Panel\Remnawave\Exceptions\ApiException;

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
     * @param Response $response
     * @return array|mixed
     * @throws ApiException
     */
    protected function handle(Response $response): mixed
    {
        if ($response->successful()) {
            return $response->json();
        }

        throw new ApiException(
            $response->json('message', 'Unknown API error'),
            $response->status(),
        );
    }
}
