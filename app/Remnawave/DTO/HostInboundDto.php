<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class HostInboundDto implements Dto
{
    /**
     * @param string|null $configProfileUuid
     * @param string|null $configProfileInboundUuid
     */
    public function __construct(
        public ?string $configProfileUuid,
        public ?string $configProfileInboundUuid,
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
        ];
    }
}
