<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;

class UserHwidDevice implements Dto
{
    /**
     * Инициализирует поля UserHwidDevice для обмена данными с Remnawave.
     *
     * @param string $hwid
     * @param int $userId
     * @param string|null $platform
     * @param string|null $osVersion
     * @param string|null $deviceModel
     * @param string|null $userAgent
     * @param string|null $requestIp
     * @param string $createdAt
     * @param string $updatedAt
     */
    public function __construct(
        public string $hwid,
        public int $userId,
        public ?string $platform,
        public ?string $osVersion,
        public ?string $deviceModel,
        public ?string $userAgent,
        public ?string $requestIp,
        public string $createdAt,
        public string $updatedAt,
    ) {}

    /**
     * Метод для создания из массива
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            hwid: $data['hwid'],
            userId: $data['userId'],
            platform: $data['platform'] ?? null,
            osVersion: $data['osVersion'] ?? null,
            deviceModel: $data['deviceModel'] ?? null,
            userAgent: $data['userAgent'] ?? null,
            requestIp: $data['requestIp'] ?? null,
            createdAt: $data['createdAt'],
            updatedAt: $data['updatedAt'],
        );
    }

    /**
     * Метод для преобразования в массив
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'hwid' => $this->hwid,
            'userId' => $this->userId,
            'platform' => $this->platform,
            'osVersion' => $this->osVersion,
            'deviceModel' => $this->deviceModel,
            'userAgent' => $this->userAgent,
            'requestIp' => $this->requestIp,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
