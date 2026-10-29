<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

final class NodeNetworkInterfaceStatsDto implements Dto
{
    /**
     * Инициализирует поля NodeNetworkInterfaceStatsDto для обмена данными с Remnawave.
     *
     * @param string $interface
     * @param float $rxBytesPerSec
     * @param float $txBytesPerSec
     * @param float $rxTotal
     * @param float $txTotal
     */
    public function __construct(
        public string $interface,
        public float $rxBytesPerSec,
        public float $txBytesPerSec,
        public float $rxTotal,
        public float $txTotal,
    ) {}

    /**
     * Создаёт NodeNetworkInterfaceStatsDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            interface: $data['interface'],
            rxBytesPerSec: $data['rxBytesPerSec'],
            txBytesPerSec: $data['txBytesPerSec'],
            rxTotal: $data['rxTotal'],
            txTotal: $data['txTotal'],
        );
    }

    /**
     * Преобразует NodeNetworkInterfaceStatsDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'interface' => $this->interface,
            'rxBytesPerSec' => $this->rxBytesPerSec,
            'txBytesPerSec' => $this->txBytesPerSec,
            'rxTotal' => $this->rxTotal,
            'txTotal' => $this->txTotal,
        ];
    }
}
