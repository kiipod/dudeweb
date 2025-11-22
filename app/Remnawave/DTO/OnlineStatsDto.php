<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class OnlineStatsDto implements Dto
{
    /**
     * @param float $lastDay
     * @param float $lastWeek
     * @param float $neverOnline
     * @param float $onlineNow
     */
    public function __construct(
        public float $lastDay,
        public float $lastWeek,
        public float $neverOnline,
        public float $onlineNow,
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
            lastDay: $data['lastDay'],
            lastWeek: $data['lastWeek'],
            neverOnline: $data['neverOnline'],
            onlineNow: $data['onlineNow'],
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
            'lastDay' => $this->lastDay,
            'lastWeek' => $this->lastWeek,
            'neverOnline' => $this->neverOnline,
            'onlineNow' => $this->onlineNow,
        ];
    }
}
