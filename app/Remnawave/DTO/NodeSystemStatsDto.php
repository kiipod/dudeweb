<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

final class NodeSystemStatsDto implements Dto
{
    /**
     * Инициализирует поля NodeSystemStatsDto для обмена данными с Remnawave.
     *
     * @param float $memoryFree
     * @param float $memoryUsed
     * @param float $uptime
     * @param float[] $loadAvg
     * @param ?NodeNetworkInterfaceStatsDto $interface
     */
    public function __construct(
        public float $memoryFree,
        public float $memoryUsed,
        public float $uptime,
        public array $loadAvg,
        public ?NodeNetworkInterfaceStatsDto $interface,
    ) {}

    /**
     * Создаёт NodeSystemStatsDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
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

    /**
     * Преобразует NodeSystemStatsDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
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
