<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\ApiKeyDto;
use App\Remnawave\DTO\Dto;

class GetAllApiTokensResponse implements Dto
{
    /**
     * @param array $apiKeys
     * @param DocsResponse $docs
     */
    public function __construct(
        public array $apiKeys,
        public DocsResponse $docs,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            apiKeys: array_map(
                fn($apiKey) => ApiKeyDto::fromArray($apiKey),
                $data['apiKeys'],
            ),
            docs: DocsResponse::fromArray($data['docs']),
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'apiKeys' => array_map(
                fn($apiKey) => $apiKey->toArray(),
                $this->apiKeys,
            ),
            'docs' => $this->docs->toArray(),
        ];
    }
}
