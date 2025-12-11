<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;
use App\Remnawave\DTO\NodeMetricsDto;

class NodesMetricsResponse implements Dto
{
    /**
     * @param array $nodes
     */
    public function __construct(
        public array $nodes,
    ) {}

    /**
     * @param array $data
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
     * @return array
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
