<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;
use App\Remnawave\DTO\InternalSquadInboundDto;
use App\Remnawave\DTO\InternalSquadInfoDto;

class InternalSquadDetailResponse implements Dto
{
    /**
     * @param string $uuid
     * @param int $viewPosition
     * @param string $name
     * @param InternalSquadInfoDto $info
     * @param array $inbounds
     * @param string $createdAt
     * @param string $updatedAt
     */
    public function __construct(
        public string $uuid,
        public int $viewPosition,
        public string $name,
        public InternalSquadInfoDto $info,
        public array $inbounds,
        public string $createdAt,
        public string $updatedAt,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            uuid: $data['uuid'],
            viewPosition: $data['viewPosition'],
            name: $data['name'],
            info: InternalSquadInfoDto::fromArray($data['info']),
            inbounds: array_map(
                fn($inbound) => InternalSquadInboundDto::fromArray($inbound),
                $data['inbounds'] ?? [],
            ),
            createdAt: $data['createdAt'],
            updatedAt: $data['updatedAt'],
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'viewPosition' => $this->viewPosition,
            'name' => $this->name,
            'info' => $this->info->toArray(),
            'inbounds' => array_map(
                fn($inbound) => $inbound->toArray(),
                $this->inbounds,
            ),
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
