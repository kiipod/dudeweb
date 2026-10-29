<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class NodesStatsDto implements Dto
{
    /**
     * Инициализирует поля NodesStatsDto для обмена данными с Remnawave.
     *
     * @param float $totalOnline
     * @param string $totalBytesLifetime
     */
    public function __construct(
        public float $totalOnline,
        public string $totalBytesLifetime,
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
            totalOnline: $data['totalOnline'],
            totalBytesLifetime: $data['totalBytesLifetime'],
        );
    }

    /**
     * Метод для преобразования в массив
     *
     * @return float[]
     */
    public function toArray(): array
    {
        return [
            'totalOnline' => $this->totalOnline,
            'totalBytesLifetime' => $this->totalBytesLifetime,
        ];
    }
}
