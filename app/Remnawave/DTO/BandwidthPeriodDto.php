<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class BandwidthPeriodDto implements Dto
{
    /**
     * @param string $current
     * @param string $previous
     * @param string $difference
     */
    public function __construct(
        public string $current,
        public string $previous,
        public string $difference,
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
            current: $data['current'],
            previous: $data['previous'],
            difference: $data['difference'],
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
            'current' => $this->current,
            'previous' => $this->previous,
            'difference' => $this->difference,
        ];
    }
}
