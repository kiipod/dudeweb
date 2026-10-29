<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\AccessibleNodeDto;
use App\Remnawave\DTO\Dto;

class InternalSquadAccessibleNodeResponse implements Dto
{
    /**
     * Инициализирует поля InternalSquadAccessibleNodeResponse для обмена данными с Remnawave.
     *
     * @param string $squadUuid
     * @param array $accessibleNodes
     */
    public function __construct(
        public string $squadUuid,
        public array $accessibleNodes,
    ) {}

    /**
     * Создаёт InternalSquadAccessibleNodeResponse из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            squadUuid: $data['squadUuid'],
            accessibleNodes: array_map(
                fn($node) => AccessibleNodeDto::fromArray($node),
                $data['accessibleNodes'] ?? [],
            ),
        );
    }

    /**
     * Преобразует InternalSquadAccessibleNodeResponse в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'squadUuid' => $this->squadUuid,
            'accessibleNodes' => array_map(
                fn($node) => $node->toArray(),
                $this->accessibleNodes,
            ),
        ];
    }
}
