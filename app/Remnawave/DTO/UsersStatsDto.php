<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class UsersStatsDto implements Dto
{
    /**
     * @param array $statusCounts
     * @param float $totalUsers
     * @param string $totalTrafficBytes
     * @param OnlineStatsDto $onlineStats
     */
    public function __construct(
        public array $statusCounts,
        public float $totalUsers,
        public string $totalTrafficBytes,
        public OnlineStatsDto $onlineStats,
    ) {}

    /**
     * Метод для создания из массива
     *
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            statusCounts: $data['statusCounts'],
            totalUsers: $data['totalUsers'],
            totalTrafficBytes: $data['totalTrafficBytes'],
            onlineStats: OnlineStatsDto::fromArray($data['onlineStats']),
        );
    }

    /**
     * Метод для преобразования в массив
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'statusCounts' => $this->statusCounts,
            'totalUsers' => $this->totalUsers,
            'totalTrafficBytes' => $this->totalTrafficBytes,
            'onlineStats' => $this->onlineStats->toArray(),
        ];
    }
}
