<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\ApiKeyDto;
use App\Remnawave\DTO\Dto;

class GetAllApiTokensResponse implements Dto
{
    /**
     * @param ApiKeyDto[] $tokens
     */
    public function __construct(
        public array $tokens,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            tokens: array_map(
                fn($apiKey) => ApiKeyDto::fromArray($apiKey),
                $data['tokens'],
            ),
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'tokens' => array_map(
                fn($apiKey) => $apiKey->toArray(),
                $this->tokens,
            ),
        ];
    }
}
