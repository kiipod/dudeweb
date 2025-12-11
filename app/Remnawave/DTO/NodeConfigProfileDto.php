<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class NodeConfigProfileDto implements Dto
{
    /**
     * @param string|null $activeConfigProfileUuid
     * @param array $activeInbounds
     */
    public function __construct(
        public ?string $activeConfigProfileUuid,
        public array $activeInbounds,
    ) {}

    /**
     * @param array $data
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
     * @return array
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
