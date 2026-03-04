<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;

class GetUserHwidDevicesResponse implements Dto
{
    /**
     * @param int $total
     * @param UserHwidDevice[] $devices
     */
    public function __construct(
        public int $total,
        public array $devices,
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
            total: $data['total'],
            devices: array_map(
                fn(array $device) => UserHwidDevice::fromArray($device),
                $data['devices'],
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
            'total' => $this->total,
            'devices' => array_map(
                fn(UserHwidDevice $device) => $device->toArray(),
                $this->devices,
            ),
        ];
    }
}
