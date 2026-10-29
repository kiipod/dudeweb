<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\CpuStatsDto;
use App\Remnawave\DTO\Dto;
use App\Remnawave\DTO\MemoryStatsDto;
use App\Remnawave\DTO\NodesStatsDto;
use App\Remnawave\DTO\OnlineStatsDto;
use App\Remnawave\DTO\UsersStatsDto;

class StatsResponse implements Dto
{
    /**
     * Инициализирует поля StatsResponse для обмена данными с Remnawave.
     *
     * @param CpuStatsDto $cpu
     * @param MemoryStatsDto $memory
     * @param float $uptime
     * @param float $timestamp
     * @param UsersStatsDto $users
     * @param OnlineStatsDto $onlineStats
     * @param NodesStatsDto $nodes
     */
    public function __construct(
        public CpuStatsDto $cpu,
        public MemoryStatsDto $memory,
        public float $uptime,
        public float $timestamp,
        public UsersStatsDto $users,
        public OnlineStatsDto $onlineStats,
        public NodesStatsDto $nodes,
    ) {}

    /**
     * Метод для создания из массива
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            cpu: CpuStatsDto::fromArray($data['cpu']),
            memory: MemoryStatsDto::fromArray($data['memory']),
            uptime: $data['uptime'],
            timestamp: $data['timestamp'],
            users: UsersStatsDto::fromArray($data['users']),
            onlineStats: OnlineStatsDto::fromArray($data['onlineStats']),
            nodes: NodesStatsDto::fromArray($data['nodes']),
        );
    }

    /**
     * Метод для преобразования в массив
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'cpu' => $this->cpu->toArray(),
            'memory' => $this->memory->toArray(),
            'uptime' => $this->uptime,
            'timestamp' => $this->timestamp,
            'users' => $this->users->toArray(),
            'onlineStats' => $this->onlineStats->toArray(),
            'nodes' => $this->nodes->toArray(),
        ];
    }
}
