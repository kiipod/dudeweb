<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

final class NodeNetworkInterfaceStatsDto implements Dto
{
    public function __construct(
        public string $interface,
        public float $rxBytesPerSec,
        public float $txBytesPerSec,
        public float $rxTotal,
        public float $txTotal,
    ) {}

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
