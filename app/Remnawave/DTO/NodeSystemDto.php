<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

final class NodeSystemDto implements Dto
{
    /**
     * Инициализирует поля NodeSystemDto для обмена данными с Remnawave.
     *
     * @param NodeSystemInfoDto $info
     * @param NodeSystemStatsDto $stats
     */
    public function __construct(
        public NodeSystemInfoDto $info,
        public NodeSystemStatsDto $stats,
    ) {}

    /**
     * Создаёт NodeSystemDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            info: NodeSystemInfoDto::fromArray($data['info']),
            stats: NodeSystemStatsDto::fromArray($data['stats']),
        );
    }

    /**
     * Преобразует NodeSystemDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return ['info' => $this->info->toArray(), 'stats' => $this->stats->toArray()];
    }
}
