<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class HostDto implements Dto
{
    /**
     * @param string $uuid
     * @param int $viewPosition
     * @param string $remark
     * @param string $address
     * @param int $port
     * @param string|null $path
     * @param string|null $sni
     * @param string|null $host
     * @param string|null $alpn
     * @param string|null $fingerprint
     * @param mixed|null $xHttpExtraParams
     * @param mixed|null $muxParams
     * @param mixed|null $sockoptParams
     * @param HostInboundDto $inbound
     * @param array $nodes
     * @param array $excludedInternalSquads
     * @param string|null $xrayJsonTemplateUuid
     * @param bool $shuffleHost
     * @param bool $mihomoX25519
     * @param bool $isDisabled
     * @param bool $isHidden
     * @param bool $overrideSniFromAddress
     * @param bool $keepSniBlank
     * @param bool $allowInsecure
     * @param string $securityLayer
     */
    public function __construct(
        public string $uuid,
        public int $viewPosition,
        public string $remark,
        public string $address,
        public int $port,
        public ?string $path,
        public ?string $sni,
        public ?string $host,
        public ?string $alpn,
        public ?string $fingerprint,
        public mixed $xHttpExtraParams = null,
        public mixed $muxParams = null,
        public mixed $sockoptParams = null,
        public HostInboundDto $inbound,
        public array $nodes = [],
        public array $excludedInternalSquads = [],
        public ?string $xrayJsonTemplateUuid = null,
        public bool $shuffleHost = false,
        public bool $mihomoX25519 = false,
        public bool $isDisabled = false,
        public bool $isHidden = false,
        public bool $overrideSniFromAddress = false,
        public bool $keepSniBlank = false,
        public bool $allowInsecure = false,
        public string $securityLayer = 'DEFAULT',
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
            remark: $data['remark'],
            address: $data['address'],
            port: $data['port'],
            path: $data['path'] ?? null,
            sni: $data['sni'] ?? null,
            host: $data['host'] ?? null,
            alpn: $data['alpn'] ?? null,
            fingerprint: $data['fingerprint'] ?? null,
            xHttpExtraParams: $data['xHttpExtraParams'] ?? null,
            muxParams: $data['muxParams'] ?? null,
            sockoptParams: $data['sockoptParams'] ?? null,
            inbound: HostInboundDto::fromArray($data['inbound']),
            nodes: $data['nodes'] ?? [],
            excludedInternalSquads: $data['excludedInternalSquads'] ?? [],
            xrayJsonTemplateUuid: $data['xrayJsonTemplateUuid'] ?? null,
            shuffleHost: $data['shuffleHost'] ?? false,
            mihomoX25519: $data['mihomoX25519'] ?? false,
            isDisabled: $data['isDisabled'] ?? false,
            isHidden: $data['isHidden'] ?? false,
            overrideSniFromAddress: $data['overrideSniFromAddress'] ?? false,
            keepSniBlank: $data['keepSniBlank'] ?? false,
            allowInsecure: $data['allowInsecure'] ?? false,
            securityLayer: $data['securityLayer'] ?? 'DEFAULT',
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
            'remark' => $this->remark,
            'address' => $this->address,
            'port' => $this->port,
            'path' => $this->path,
            'sni' => $this->sni,
            'host' => $this->host,
            'alpn' => $this->alpn,
            'fingerprint' => $this->fingerprint,
            'xHttpExtraParams' => $this->xHttpExtraParams,
            'muxParams' => $this->muxParams,
            'sockoptParams' => $this->sockoptParams,
            'inbound' => $this->inbound->toArray(),
            'nodes' => $this->nodes,
            'excludedInternalSquads' => $this->excludedInternalSquads,
            'xrayJsonTemplateUuid' => $this->xrayJsonTemplateUuid,
            'shuffleHost' => $this->shuffleHost,
            'mihomoX25519' => $this->mihomoX25519,
            'isDisabled' => $this->isDisabled,
            'isHidden' => $this->isHidden,
            'overrideSniFromAddress' => $this->overrideSniFromAddress,
            'keepSniBlank' => $this->keepSniBlank,
            'allowInsecure' => $this->allowInsecure,
            'securityLayer' => $this->securityLayer,
        ];
    }
}
