<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;
use App\Remnawave\DTO\NodeMetricsDto;

class NodesMetricsResponse implements Dto
{
    /**
     * Инициализирует поля NodesMetricsResponse для обмена данными с Remnawave.
     *
     * @param array $nodes
     */
    public function __construct(
        public array $nodes,
    ) {}

    /**
     * Создаёт NodesMetricsResponse из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            nodes: array_map(
                fn($node) => NodeMetricsDto::fromArray($node),
                $data['nodes'] ?? [],
            ),
        );
    }

    /**
     * Преобразует NodesMetricsResponse в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'nodes' => array_map(
                fn($node) => $node->toArray(),
                $this->nodes,
            ),
        ];
    }
}
