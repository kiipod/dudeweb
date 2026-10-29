<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\ApiKeyDto;
use App\Remnawave\DTO\Dto;

class GetAllApiTokensResponse implements Dto
{
    /**
     * Инициализирует поля GetAllApiTokensResponse для обмена данными с Remnawave.
     *
     * @param ApiKeyDto[] $tokens
     */
    public function __construct(
        public array $tokens,
    ) {}

    /**
     * Создаёт GetAllApiTokensResponse из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
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
     * Преобразует GetAllApiTokensResponse в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
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
