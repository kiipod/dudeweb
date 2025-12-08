<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class AccessibleNodeDto implements Dto
{
    /**
     * @param string $uuid
     * @param string $nodeName
     * @param string $countryCode
     * @param string $configProfileUuid
     * @param string $configProfileName
     * @param array $activeInbounds
     */
    public function __construct(
        public string $uuid,
        public string $nodeName,
        public string $countryCode,
        public string $configProfileUuid,
        public string $configProfileName,
        public array $activeInbounds,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            uuid: $data['uuid'],
            nodeName: $data['nodeName'],
            countryCode: $data['countryCode'],
            configProfileUuid: $data['configProfileUuid'],
            configProfileName: $data['configProfileName'],
            activeInbounds: $data['activeInbounds'] ?? [],
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'nodeName' => $this->nodeName,
            'countryCode' => $this->countryCode,
            'configProfileUuid' => $this->configProfileUuid,
            'configProfileName' => $this->configProfileName,
            'activeInbounds' => $this->activeInbounds,
        ];
    }
}
