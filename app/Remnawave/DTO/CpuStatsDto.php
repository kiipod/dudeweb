<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class CpuStatsDto implements Dto
{
    /**
     * @param float $cores
     * @param float $physicalCores
     */
    public function __construct(
        public float $cores,
        public float $physicalCores,
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
            cores: $data['cores'],
            physicalCores: $data['physicalCores'],
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
            'cores' => $this->cores,
            'physicalCores' => $this->physicalCores,
        ];
    }
}
