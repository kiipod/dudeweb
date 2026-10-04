<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class NodeActiveInboundDto implements Dto
{
    /**
     * @param string $uuid
     * @param string $profileUuid
     * @param string $tag
     * @param string $type
     * @param string|null $network
     * @param string|null $security
     * @param float|null $port
     * @param mixed|null $rawInbound
     */
    public function __construct(
        public string $uuid,
        public string $profileUuid,
        public string $tag,
        public string $type,
        public ?string $network,
        public ?string $security,
        public ?float $port,
        public mixed $rawInbound = null,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            uuid: $data['uuid'],
            profileUuid: $data['profileUuid'],
            tag: $data['tag'],
            type: $data['type'],
            network: $data['network'] ?? null,
            security: $data['security'] ?? null,
            port: $data['port'] ?? null,
            rawInbound: $data['rawInbound'] ?? null,
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'profileUuid' => $this->profileUuid,
            'tag' => $this->tag,
            'type' => $this->type,
            'network' => $this->network,
            'security' => $this->security,
            'port' => $this->port,
            'rawInbound' => $this->rawInbound,
        ];
    }
}
