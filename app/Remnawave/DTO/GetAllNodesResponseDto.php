<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class GetAllNodesResponseDto implements Dto
{
    /**
     * Инициализирует поля GetAllNodesResponseDto для обмена данными с Remnawave.
     *
     * @param array $response
     */
    public function __construct(
        public array $response,
    ) {}

    /**
     * Создаёт GetAllNodesResponseDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     *
     * @throws \ValueError
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: array_map(
                fn($node) => NodeDto::fromArray($node),
                $data['response'],
            ),
        );
    }

    /**
     * Преобразует GetAllNodesResponseDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'response' => array_map(
                fn($node) => $node->toArray(),
                $this->response,
            ),
        ];
    }
}
