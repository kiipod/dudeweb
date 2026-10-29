<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class UserTrafficDto implements Dto
{
    /**
     * Инициализирует поля UserTrafficDto для обмена данными с Remnawave.
     *
     * @param float $usedTrafficBytes
     * @param float $lifetimeUsedTrafficBytes
     * @param string|null $onlineAt
     * @param string|null $firstConnectedAt
     * @param string|null $lastConnectedNodeUuid
     */
    public function __construct(
        public float $usedTrafficBytes,
        public float $lifetimeUsedTrafficBytes,
        public ?string $onlineAt,
        public ?string $firstConnectedAt,
        public ?string $lastConnectedNodeUuid,
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
            usedTrafficBytes: $data['usedTrafficBytes'],
            lifetimeUsedTrafficBytes: $data['lifetimeUsedTrafficBytes'],
            onlineAt: $data['onlineAt'] ?? null,
            firstConnectedAt: $data['firstConnectedAt'] ?? null,
            lastConnectedNodeUuid: $data['lastConnectedNodeUuid'] ?? null,
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
            'usedTrafficBytes' => $this->usedTrafficBytes,
            'lifetimeUsedTrafficBytes' => $this->lifetimeUsedTrafficBytes,
            'onlineAt' => $this->onlineAt,
            'firstConnectedAt' => $this->firstConnectedAt,
            'lastConnectedNodeUuid' => $this->lastConnectedNodeUuid,
        ];
    }
}
