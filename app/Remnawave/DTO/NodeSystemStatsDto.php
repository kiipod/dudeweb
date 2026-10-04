<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

final class NodeSystemStatsDto implements Dto
{
    /** @param float[] $loadAvg */
    public function __construct(
        public float $memoryFree,
        public float $memoryUsed,
        public float $uptime,
        public array $loadAvg,
        public ?NodeNetworkInterfaceStatsDto $interface,
    ) {}

    public static function fromArray(array $data): static
    {
        return new self(
            memoryFree: $data['memoryFree'],
            memoryUsed: $data['memoryUsed'],
            uptime: $data['uptime'],
            loadAvg: $data['loadAvg'],
            interface: isset($data['interface'])
                ? NodeNetworkInterfaceStatsDto::fromArray($data['interface'])
                : null,
        );
    }

    public function toArray(): array
    {
        return [
            'memoryFree' => $this->memoryFree,
            'memoryUsed' => $this->memoryUsed,
            'uptime' => $this->uptime,
            'loadAvg' => $this->loadAvg,
            'interface' => $this->interface?->toArray(),
        ];
    }
}
