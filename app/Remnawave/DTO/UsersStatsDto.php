<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class UsersStatsDto implements Dto
{
    /**
     * @param array $statusCounts
     * @param float $totalUsers
     */
    public function __construct(
        public array $statusCounts,
        public float $totalUsers,
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
        ];
    }
}
