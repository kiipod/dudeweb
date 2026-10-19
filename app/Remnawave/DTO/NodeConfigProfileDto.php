<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class NodeConfigProfileDto implements Dto
{
    /**
     * Инициализирует поля NodeConfigProfileDto для обмена данными с Remnawave.
     *
     * @param string|null $activeConfigProfileUuid
     * @param array $activeInbounds
     */
    public function __construct(
        public ?string $activeConfigProfileUuid,
        public array $activeInbounds,
    ) {}

    /**
     * Создаёт NodeConfigProfileDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            activeConfigProfileUuid: $data['activeConfigProfileUuid'] ?? null,
            activeInbounds: array_map(
                fn($inbound) => NodeActiveInboundDto::fromArray($inbound),
                $data['activeInbounds'] ?? [],
            ),
        );
    }

    /**
     * Преобразует NodeConfigProfileDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'activeConfigProfileUuid' => $this->activeConfigProfileUuid,
            'activeInbounds' => array_map(
                fn($inbound) => $inbound->toArray(),
                $this->activeInbounds,
            ),
        ];
    }
}
