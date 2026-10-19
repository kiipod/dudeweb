<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class MemoryStatsDto implements Dto
{
    /**
     * Инициализирует поля MemoryStatsDto для обмена данными с Remnawave.
     *
     * @param float $total
     * @param float $free
     * @param float $used
     */
    public function __construct(
        public float $total,
        public float $free,
        public float $used,
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
            total: $data['total'],
            free: $data['free'],
            used: $data['used'],
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
            'total' => $this->total,
            'free' => $this->free,
            'used' => $this->used,
        ];
    }
}
