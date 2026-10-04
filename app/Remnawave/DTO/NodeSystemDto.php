<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

final class NodeSystemDto implements Dto
{
    public function __construct(
        public NodeSystemInfoDto $info,
        public NodeSystemStatsDto $stats,
    ) {}

    public static function fromArray(array $data): static
    {
        return new self(
            info: NodeSystemInfoDto::fromArray($data['info']),
            stats: NodeSystemStatsDto::fromArray($data['stats']),
        );
    }

    public function toArray(): array
    {
        return ['info' => $this->info->toArray(), 'stats' => $this->stats->toArray()];
    }
}
