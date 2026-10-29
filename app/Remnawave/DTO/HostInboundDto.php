<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class HostInboundDto implements Dto
{
    /**
     * Инициализирует поля HostInboundDto для обмена данными с Remnawave.
     *
     * @param string|null $configProfileUuid
     * @param string|null $configProfileInboundUuid
     */
    public function __construct(
        public ?string $configProfileUuid,
        public ?string $configProfileInboundUuid,
    ) {}

    /**
     * Создаёт HostInboundDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            configProfileUuid: $data['configProfileUuid'] ?? null,
            configProfileInboundUuid: $data['configProfileInboundUuid'] ?? null,
        );
    }

    /**
     * Преобразует HostInboundDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'configProfileUuid' => $this->configProfileUuid,
            'configProfileInboundUuid' => $this->configProfileInboundUuid,
        ];
    }
}
