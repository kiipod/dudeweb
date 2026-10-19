<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class CpuStatsDto implements Dto
{
    /**
     * Инициализирует поля CpuStatsDto для обмена данными с Remnawave.
     *
     * @param float $cores
     */
    public function __construct(
        public float $cores,
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
            cores: $data['cores'],
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
            'cores' => $this->cores,
        ];
    }
}
