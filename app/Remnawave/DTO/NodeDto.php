<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class NodeDto implements Dto
{
    /**
     * @param string $uuid
     * @param string $name
     * @param string $address
     * @param int|null $port
     * @param bool $isConnected
     * @param bool $isDisabled
     * @param bool $isConnecting
     * @param string|null $lastStatusChange
     * @param string|null $lastStatusMessage
     * @param string|null $xrayVersion
     * @param string|null $nodeVersion
     * @param string $xrayUptime
     * @param bool $isTrafficTrackingActive
     * @param int|null $trafficResetDay
     * @param float|null $trafficLimitBytes
     * @param float|null $trafficUsedBytes
     * @param int|null $notifyPercent
     * @param int|null $usersOnline
     * @param int $viewPosition
     * @param string $countryCode
     * @param float $consumptionMultiplier
     * @param array $tags
     * @param int|null $cpuCount
     * @param string|null $cpuModel
     * @param string|null $totalRam
     * @param string $createdAt
     * @param string $updatedAt
     * @param NodeConfigProfileDto $configProfile
     * @param string|null $providerUuid
     * @param ProviderDto|null $provider
     */
    public function __construct(
        public string $uuid,
        public string $name,
        public string $address,
        public ?int $port,
        public bool $isConnected,
        public bool $isDisabled,
        public bool $isConnecting,
        public ?string $lastStatusChange,
        public ?string $lastStatusMessage,
        public ?string $xrayVersion,
        public ?string $nodeVersion,
        public string $xrayUptime,
        public bool $isTrafficTrackingActive,
        public ?int $trafficResetDay,
        public ?float $trafficLimitBytes,
        public ?float $trafficUsedBytes,
        public ?int $notifyPercent,
        public ?int $usersOnline,
        public int $viewPosition,
        public string $countryCode,
        public float $consumptionMultiplier,
        public array $tags,
        public ?int $cpuCount,
        public ?string $cpuModel,
        public ?string $totalRam,
        public string $createdAt,
        public string $updatedAt,
        public NodeConfigProfileDto $configProfile,
        public ?string $providerUuid,
        public ?ProviderDto $provider,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            uuid: $data['uuid'],
            name: $data['name'],
            address: $data['address'],
            port: $data['port'] ?? null,
            isConnected: $data['isConnected'],
            isDisabled: $data['isDisabled'],
            isConnecting: $data['isConnecting'],
            lastStatusChange: $data['lastStatusChange'] ?? null,
            lastStatusMessage: $data['lastStatusMessage'] ?? null,
            xrayVersion: $data['xrayVersion'] ?? null,
            nodeVersion: $data['nodeVersion'] ?? null,
            xrayUptime: $data['xrayUptime'],
            isTrafficTrackingActive: $data['isTrafficTrackingActive'],
            trafficResetDay: $data['trafficResetDay'] ?? null,
            trafficLimitBytes: $data['trafficLimitBytes'] ?? null,
            trafficUsedBytes: $data['trafficUsedBytes'] ?? null,
            notifyPercent: $data['notifyPercent'] ?? null,
            usersOnline: $data['usersOnline'] ?? null,
            viewPosition: $data['viewPosition'],
            countryCode: $data['countryCode'],
            consumptionMultiplier: $data['consumptionMultiplier'],
            tags: $data['tags'] ?? [],
            cpuCount: $data['cpuCount'] ?? null,
            cpuModel: $data['cpuModel'] ?? null,
            totalRam: $data['totalRam'] ?? null,
            createdAt: $data['createdAt'],
            updatedAt: $data['updatedAt'],
            configProfile: NodeConfigProfileDto::fromArray($data['configProfile']),
            providerUuid: $data['providerUuid'] ?? null,
            provider: isset($data['provider'])
                ? ProviderDto::fromArray($data['provider'])
                : null,
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        $result = [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'address' => $this->address,
            'port' => $this->port,
            'isConnected' => $this->isConnected,
            'isDisabled' => $this->isDisabled,
            'isConnecting' => $this->isConnecting,
            'lastStatusChange' => $this->lastStatusChange,
            'lastStatusMessage' => $this->lastStatusMessage,
            'xrayVersion' => $this->xrayVersion,
            'nodeVersion' => $this->nodeVersion,
            'xrayUptime' => $this->xrayUptime,
            'isTrafficTrackingActive' => $this->isTrafficTrackingActive,
            'trafficResetDay' => $this->trafficResetDay,
            'trafficLimitBytes' => $this->trafficLimitBytes,
            'trafficUsedBytes' => $this->trafficUsedBytes,
            'notifyPercent' => $this->notifyPercent,
            'usersOnline' => $this->usersOnline,
            'viewPosition' => $this->viewPosition,
            'countryCode' => $this->countryCode,
            'consumptionMultiplier' => $this->consumptionMultiplier,
            'tags' => $this->tags,
            'cpuCount' => $this->cpuCount,
            'cpuModel' => $this->cpuModel,
            'totalRam' => $this->totalRam,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'configProfile' => $this->configProfile->toArray(),
            'providerUuid' => $this->providerUuid,
        ];

        if ($this->provider !== null) {
            $result['provider'] = $this->provider->toArray();
        }

        return $result;
    }
}
