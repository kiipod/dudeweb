<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class HostInboundDto implements Dto
{
    /**
     * @param string|null $configProfileUuid
     * @param string|null $configProfileInboundUuid
     * @param string|null $serverDescription
     * @param string|null $tag
     * @param int|null $vlessRouteId
     */
    public function __construct(
        public ?string $configProfileUuid,
        public ?string $configProfileInboundUuid,
        public ?string $serverDescription,
        public ?string $tag,
        public ?int $vlessRouteId,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            configProfileUuid: $data['configProfileUuid'] ?? null,
            configProfileInboundUuid: $data['configProfileInboundUuid'] ?? null,
            serverDescription: $data['serverDescription'] ?? null,
            tag: $data['tag'] ?? null,
            vlessRouteId: $data['vlessRouteId'] ?? null,
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'configProfileUuid' => $this->configProfileUuid,
            'configProfileInboundUuid' => $this->configProfileInboundUuid,
            'serverDescription' => $this->serverDescription,
            'tag' => $this->tag,
            'vlessRouteId' => $this->vlessRouteId,
        ];
    }
}
