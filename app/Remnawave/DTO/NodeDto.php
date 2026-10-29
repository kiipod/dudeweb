<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

final class NodeDto implements Dto
{
    /**
     * Инициализирует поля NodeDto для обмена данными с Remnawave.
     *
     * @param string $uuid
     * @param int $id
     * @param string $name
     * @param string $address
     * @param ?int $port
     * @param ?string $proxyUrl
     * @param bool $isConnected
     * @param bool $isDisabled
     * @param bool $isConnecting
     * @param ?string $lastStatusChange
     * @param ?string $lastStatusMessage
     * @param bool $isTrafficTrackingActive
     * @param ?int $trafficResetDay
     * @param ?float $trafficLimitBytes
     * @param ?float $trafficUsedBytes
     * @param ?int $notifyPercent
     * @param int $viewPosition
     * @param string $countryCode
     * @param float $consumptionMultiplier
     * @param float $nodeConsumptionMultiplier
     * @param string[] $tags
     * @param string[] $integrationUuids
     * @param NodeIpDto[] $ips
     * @param string $createdAt
     * @param string $updatedAt
     * @param NodeConfigProfileDto $configProfile
     * @param ?string $providerUuid
     * @param ?ProviderDto $provider
     * @param ?string $activePluginUuid
     * @param ?NodeSystemDto $system
     * @param ?NodeVersionsDto $versions
     * @param float $xrayUptime
     * @param float $usersOnline
     * @param ?string $note
     */
    public function __construct(
        public string $uuid,
        public int $id,
        public string $name,
        public string $address,
        public ?int $port,
        public ?string $proxyUrl,
        public bool $isConnected,
        public bool $isDisabled,
        public bool $isConnecting,
        public ?string $lastStatusChange,
        public ?string $lastStatusMessage,
        public bool $isTrafficTrackingActive,
        public ?int $trafficResetDay,
        public ?float $trafficLimitBytes,
        public ?float $trafficUsedBytes,
        public ?int $notifyPercent,
        public int $viewPosition,
        public string $countryCode,
        public float $consumptionMultiplier,
        public float $nodeConsumptionMultiplier,
        public array $tags,
        public array $integrationUuids,
        public array $ips,
        public string $createdAt,
        public string $updatedAt,
        public NodeConfigProfileDto $configProfile,
        public ?string $providerUuid,
        public ?ProviderDto $provider,
        public ?string $activePluginUuid,
        public ?NodeSystemDto $system,
        public ?NodeVersionsDto $versions,
        public float $xrayUptime,
        public float $usersOnline,
        public ?string $note,
    ) {}

    /**
     * Создаёт NodeDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     *
     * @throws \ValueError
     */
    public static function fromArray(array $data): static
    {
        return new self(
            uuid: $data['uuid'],
            id: $data['id'],
            name: $data['name'],
            address: $data['address'],
            port: $data['port'] ?? null,
            proxyUrl: $data['proxyUrl'] ?? null,
            isConnected: $data['isConnected'],
            isDisabled: $data['isDisabled'],
            isConnecting: $data['isConnecting'],
            lastStatusChange: $data['lastStatusChange'] ?? null,
            lastStatusMessage: $data['lastStatusMessage'] ?? null,
            isTrafficTrackingActive: $data['isTrafficTrackingActive'],
            trafficResetDay: $data['trafficResetDay'] ?? null,
            trafficLimitBytes: $data['trafficLimitBytes'] ?? null,
            trafficUsedBytes: $data['trafficUsedBytes'] ?? null,
            notifyPercent: $data['notifyPercent'] ?? null,
            viewPosition: $data['viewPosition'],
            countryCode: $data['countryCode'],
            consumptionMultiplier: $data['consumptionMultiplier'],
            nodeConsumptionMultiplier: $data['nodeConsumptionMultiplier'],
            tags: $data['tags'],
            integrationUuids: $data['integrationUuids'],
            ips: array_map(
                fn(array $ip): NodeIpDto => NodeIpDto::fromArray($ip),
                $data['ips'],
            ),
            createdAt: $data['createdAt'],
            updatedAt: $data['updatedAt'],
            configProfile: NodeConfigProfileDto::fromArray($data['configProfile']),
            providerUuid: $data['providerUuid'] ?? null,
            provider: isset($data['provider']) ? ProviderDto::fromArray($data['provider']) : null,
            activePluginUuid: $data['activePluginUuid'] ?? null,
            system: isset($data['system']) ? NodeSystemDto::fromArray($data['system']) : null,
            versions: isset($data['versions']) ? NodeVersionsDto::fromArray($data['versions']) : null,
            xrayUptime: $data['xrayUptime'],
            usersOnline: $data['usersOnline'],
            note: $data['note'] ?? null,
        );
    }

    /**
     * Преобразует NodeDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'port' => $this->port,
            'proxyUrl' => $this->proxyUrl,
            'isConnected' => $this->isConnected,
            'isDisabled' => $this->isDisabled,
            'isConnecting' => $this->isConnecting,
            'lastStatusChange' => $this->lastStatusChange,
            'lastStatusMessage' => $this->lastStatusMessage,
            'isTrafficTrackingActive' => $this->isTrafficTrackingActive,
            'trafficResetDay' => $this->trafficResetDay,
            'trafficLimitBytes' => $this->trafficLimitBytes,
            'trafficUsedBytes' => $this->trafficUsedBytes,
            'notifyPercent' => $this->notifyPercent,
            'viewPosition' => $this->viewPosition,
            'countryCode' => $this->countryCode,
            'consumptionMultiplier' => $this->consumptionMultiplier,
            'nodeConsumptionMultiplier' => $this->nodeConsumptionMultiplier,
            'tags' => $this->tags,
            'integrationUuids' => $this->integrationUuids,
            'ips' => array_map(
                fn(NodeIpDto $ip): array => $ip->toArray(),
                $this->ips,
            ),
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'configProfile' => $this->configProfile->toArray(),
            'providerUuid' => $this->providerUuid,
            'provider' => $this->provider?->toArray(),
            'activePluginUuid' => $this->activePluginUuid,
            'system' => $this->system?->toArray(),
            'versions' => $this->versions?->toArray(),
            'xrayUptime' => $this->xrayUptime,
            'usersOnline' => $this->usersOnline,
            'note' => $this->note,
        ];
    }
}
