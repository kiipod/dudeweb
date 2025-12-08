<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\AccessibleNodeDto;
use App\Remnawave\DTO\Dto;

class InternalSquadResponse implements Dto
{
    /**
     * @param string $squadUuid
     * @param array $accessibleNodes
     */
    public function __construct(
        public string $squadUuid,
        public array $accessibleNodes,
    ) {}

    /**
     * @param array $data
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
     * @return array
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
