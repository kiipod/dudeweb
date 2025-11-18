<?php

declare (strict_types=1);

namespace App\Remnawave\DTO;

class HappDto implements Dto
{
    /**
     * @param string $cryptoLink
     * @param string $status
     * @param int $trafficLimitBytes
     * @param string $trafficLimitStrategy
     * @param int $lastTriggeredThreshold
     */
    public function __construct(
        public string $cryptoLink,
        public string $status = 'ACTIVE',
        public int $trafficLimitBytes = 0,
        public string $trafficLimitStrategy = 'NO_RESET',
        public int $lastTriggeredThreshold = 0,
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
            cryptoLink: $data['cryptoLink'],
            status: $data['status'] ?? 'ACTIVE',
            trafficLimitBytes: $data['trafficLimitBytes'] ?? 0,
            trafficLimitStrategy: $data['trafficLimitStrategy'] ?? 'NO_RESET',
            lastTriggeredThreshold: $data['lastTriggeredThreshold'] ?? 0,
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
            'cryptoLink' => $this->cryptoLink,
            'status' => $this->status,
            'trafficLimitBytes' => $this->trafficLimitBytes,
            'trafficLimitStrategy' => $this->trafficLimitStrategy,
            'lastTriggeredThreshold' => $this->lastTriggeredThreshold,
        ];
    }
}
