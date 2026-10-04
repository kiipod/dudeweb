<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\Enums\HostAlpn;
use App\Remnawave\Enums\HostSecurityLayer;
use App\Remnawave\Enums\MihomoIpVersion;
use App\Remnawave\Enums\SubscriptionType;

final class HostDto implements Dto
{
    /**
     * @param string[] $tags
     * @param string[] $nodes
     * @param SubscriptionType[] $excludeFromSubscriptionTypes
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
        public ?HostAlpn $alpn,
        public ?string $fingerprint,
        public bool $isDisabled,
        public mixed $xhttpExtraParams,
        public mixed $muxParams,
        public mixed $sockoptParams,
        public mixed $finalMask,
        public HostInboundDto $inbound,
        public ?string $serverDescription,
        public ?int $vlessRouteId,
        public ?string $pinnedPeerCertSha256,
        public ?string $verifyPeerCertByName,
        public bool $shuffleHost,
        public bool $mihomoX25519,
        public ?MihomoIpVersion $mihomoIpVersion,
        public array $nodes,
        public ?string $xrayJsonTemplateUuid,
        public array $excludeFromSubscriptionTypes,
        public HostMapperDto $mapper,
        public HostInternalSquadsDto $internalSquads,
        public HostSecurityLayer $securityLayer = HostSecurityLayer::Default,
        public array $tags = [],
        public bool $isHidden = false,
        public bool $overrideSniFromAddress = false,
        public bool $keepSniBlank = false,
    ) {}

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
            alpn: isset($data['alpn']) ? HostAlpn::from($data['alpn']) : null,
            fingerprint: $data['fingerprint'] ?? null,
            isDisabled: $data['isDisabled'],
            xhttpExtraParams: $data['xhttpExtraParams'] ?? null,
            muxParams: $data['muxParams'] ?? null,
            sockoptParams: $data['sockoptParams'] ?? null,
            finalMask: $data['finalMask'] ?? null,
            inbound: HostInboundDto::fromArray($data['inbound']),
            serverDescription: $data['serverDescription'] ?? null,
            vlessRouteId: $data['vlessRouteId'] ?? null,
            pinnedPeerCertSha256: $data['pinnedPeerCertSha256'] ?? null,
            verifyPeerCertByName: $data['verifyPeerCertByName'] ?? null,
            shuffleHost: $data['shuffleHost'],
            mihomoX25519: $data['mihomoX25519'],
            mihomoIpVersion: isset($data['mihomoIpVersion'])
                ? MihomoIpVersion::from($data['mihomoIpVersion'])
                : null,
            nodes: $data['nodes'],
            xrayJsonTemplateUuid: $data['xrayJsonTemplateUuid'] ?? null,
            excludeFromSubscriptionTypes: array_map(
                fn(string $type): SubscriptionType => SubscriptionType::from($type),
                $data['excludeFromSubscriptionTypes'],
            ),
            mapper: HostMapperDto::fromArray($data['mapper']),
            internalSquads: HostInternalSquadsDto::fromArray($data['internalSquads']),
            securityLayer: isset($data['securityLayer'])
                ? HostSecurityLayer::from($data['securityLayer'])
                : HostSecurityLayer::Default,
            tags: $data['tags'] ?? [],
            isHidden: $data['isHidden'] ?? false,
            overrideSniFromAddress: $data['overrideSniFromAddress'] ?? false,
            keepSniBlank: $data['keepSniBlank'] ?? false,
        );
    }

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
            'alpn' => $this->alpn?->value,
            'fingerprint' => $this->fingerprint,
            'isDisabled' => $this->isDisabled,
            'securityLayer' => $this->securityLayer->value,
            'xhttpExtraParams' => $this->xhttpExtraParams,
            'muxParams' => $this->muxParams,
            'sockoptParams' => $this->sockoptParams,
            'finalMask' => $this->finalMask,
            'inbound' => $this->inbound->toArray(),
            'serverDescription' => $this->serverDescription,
            'tags' => $this->tags,
            'isHidden' => $this->isHidden,
            'overrideSniFromAddress' => $this->overrideSniFromAddress,
            'keepSniBlank' => $this->keepSniBlank,
            'vlessRouteId' => $this->vlessRouteId,
            'pinnedPeerCertSha256' => $this->pinnedPeerCertSha256,
            'verifyPeerCertByName' => $this->verifyPeerCertByName,
            'shuffleHost' => $this->shuffleHost,
            'mihomoX25519' => $this->mihomoX25519,
            'mihomoIpVersion' => $this->mihomoIpVersion?->value,
            'nodes' => $this->nodes,
            'xrayJsonTemplateUuid' => $this->xrayJsonTemplateUuid,
            'excludeFromSubscriptionTypes' => array_map(
                fn(SubscriptionType $type): string => $type->value,
                $this->excludeFromSubscriptionTypes,
            ),
            'mapper' => $this->mapper->toArray(),
            'internalSquads' => $this->internalSquads->toArray(),
        ];
    }
}
