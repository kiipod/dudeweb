<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;
use App\Remnawave\DTO\Pm2StatDto;

class HealthResponse implements Dto
{
    /**
     * @param array $pm2Stats
     */
    public function __construct(
        public array $pm2Stats,
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
            pm2Stats: array_map(
                fn($stat) => Pm2StatDto::fromArray($stat),
                $data['pm2Stats'],
            ),
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
            'pm2Stats' => array_map(
                fn($stat) => $stat->toArray(),
                $this->pm2Stats,
            ),
        ];
    }
}
