<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;

class UserHwidDevice implements Dto
{
    /**
     * @param string $hwid
     * @param string $userUuid
     * @param string|null $platform
     * @param string|null $osVersion
     * @param string|null $deviceModel
     * @param string|null $userAgent
     * @param string $createdAt
     * @param string $updatedAt
     */
    public function __construct(
        public string $hwid,
        public string $userUuid,
        public ?string $platform,
        public ?string $osVersion,
        public ?string $deviceModel,
        public ?string $userAgent,
        public string $createdAt,
        public string $updatedAt,
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
            hwid: $data['hwid'],
            userUuid: $data['userUuid'],
            platform: $data['platform'] ?? null,
            osVersion: $data['osVersion'] ?? null,
            deviceModel: $data['deviceModel'] ?? null,
            userAgent: $data['userAgent'] ?? null,
            createdAt: $data['createdAt'],
            updatedAt: $data['updatedAt'],
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
            'hwid' => $this->hwid,
            'userUuid' => $this->userUuid,
            'platform' => $this->platform,
            'osVersion' => $this->osVersion,
            'deviceModel' => $this->deviceModel,
            'userAgent' => $this->userAgent,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
