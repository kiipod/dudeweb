<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class NodesStatsDto implements Dto
{
    /**
     * @param float $totalOnline
     */
    public function __construct(
        public float $totalOnline,
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
            totalOnline: $data['totalOnline'],
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
        ];
    }
}
