<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\ActiveInternalSquadDto;
use App\Remnawave\DTO\Dto;
use App\Remnawave\DTO\HappDto;
use App\Remnawave\DTO\LastConnectedNodeDto;

class UserResponse implements Dto
{
    /**
     * @param string $uuid
     * @param string $shortUuid
     * @param string $username
     * @param float $usedTrafficBytes
     * @param float $lifetimeUsedTrafficBytes
     * @param string|null $subLastUserAgent
     * @param string|null $subLastOpenedAt
     * @param string $expireAt
     * @param string|null $onlineAt
     * @param string|null $subRevokedAt
     * @param string|null $lastTrafficResetAt
     * @param string $trojanPassword
     * @param string $vlessUuid
     * @param string $ssPassword
     * @param string|null $description
     * @param string|null $tag
     * @param int|null $telegramId
     * @param string|null $email
     * @param int|null $hwidDeviceLimit
     * @param string|null $firstConnectedAt
     * @param string $createdAt
     * @param string $updatedAt
     * @param array $activeInternalSquads
     * @param string|null $externalSquadUuid
     * @param string $subscriptionUrl
     * @param LastConnectedNodeDto|null $lastConnectedNode
     * @param HappDto $happ
     * @param string $status
     * @param int $trafficLimitBytes
     * @param string $trafficLimitStrategy
     * @param int $lastTriggeredThreshold
     */
    public function __construct(
        public string $uuid,
        public string $shortUuid,
        public string $username,
        public float $usedTrafficBytes,
        public float $lifetimeUsedTrafficBytes,
        public ?string $subLastUserAgent,
        public ?string $subLastOpenedAt,
        public string $expireAt,
        public ?string $onlineAt,
        public ?string $subRevokedAt,
        public ?string $lastTrafficResetAt,
        public string $trojanPassword,
        public string $vlessUuid,
        public string $ssPassword,
        public ?string $description,
        public ?string $tag,
        public ?int $telegramId,
        public ?string $email,
        public ?int $hwidDeviceLimit,
        public ?string $firstConnectedAt,
        public string $createdAt,
        public string $updatedAt,
        public array $activeInternalSquads,
        public ?string $externalSquadUuid,
        public string $subscriptionUrl,
        public ?LastConnectedNodeDto $lastConnectedNode,
        public HappDto $happ,
        public string $status = 'ACTIVE',
        public int $trafficLimitBytes = 0,
        public string $trafficLimitStrategy = 'NO_RESET',
        public int $lastTriggeredThreshold = 0,
    ) {}

    /**
     * Метод для создания из массива
     *
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            uuid: $data['uuid'],
            shortUuid: $data['shortUuid'],
            username: $data['username'],
            usedTrafficBytes: $data['usedTrafficBytes'],
            lifetimeUsedTrafficBytes: $data['lifetimeUsedTrafficBytes'],
            subLastUserAgent: $data['subLastUserAgent'] ?? null,
            subLastOpenedAt: $data['subLastOpenedAt'] ?? null,
            expireAt: $data['expireAt'],
            onlineAt: $data['onlineAt'] ?? null,
            subRevokedAt: $data['subRevokedAt'] ?? null,
            lastTrafficResetAt: $data['lastTrafficResetAt'] ?? null,
            trojanPassword: $data['trojanPassword'],
            vlessUuid: $data['vlessUuid'],
            ssPassword: $data['ssPassword'],
            description: $data['description'] ?? null,
            tag: $data['tag'] ?? null,
            telegramId: $data['telegramId'] ?? null,
            email: $data['email'] ?? null,
            hwidDeviceLimit: $data['hwidDeviceLimit'] ?? null,
            firstConnectedAt: $data['firstConnectedAt'] ?? null,
            createdAt: $data['createdAt'],
            updatedAt: $data['updatedAt'],
            activeInternalSquads: array_map(
                fn($squad) => ActiveInternalSquadDto::fromArray($squad),
                $data['activeInternalSquads'] ?? [],
            ),
            externalSquadUuid: $data['externalSquadUuid'] ?? null,
            subscriptionUrl: $data['subscriptionUrl'],
            lastConnectedNode: isset($data['lastConnectedNode'])
                ? LastConnectedNodeDto::fromArray($data['lastConnectedNode'])
                : null,
            happ: HappDto::fromArray($data['happ']),
            status: $data['status'] ?? 'ACTIVE',
            trafficLimitBytes: $data['trafficLimitBytes'] ?? 0,
            trafficLimitStrategy: $data['trafficLimitStrategy'] ?? 'NO_RESET',
            lastTriggeredThreshold: $data['lastTriggeredThreshold'] ?? 0,
        );
    }

    /**
     * Метод для преобразования в массив
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'shortUuid' => $this->shortUuid,
            'username' => $this->username,
            'usedTrafficBytes' => $this->usedTrafficBytes,
            'lifetimeUsedTrafficBytes' => $this->lifetimeUsedTrafficBytes,
            'subLastUserAgent' => $this->subLastUserAgent,
            'subLastOpenedAt' => $this->subLastOpenedAt,
            'expireAt' => $this->expireAt,
            'onlineAt' => $this->onlineAt,
            'subRevokedAt' => $this->subRevokedAt,
            'lastTrafficResetAt' => $this->lastTrafficResetAt,
            'trojanPassword' => $this->trojanPassword,
            'vlessUuid' => $this->vlessUuid,
            'ssPassword' => $this->ssPassword,
            'description' => $this->description,
            'tag' => $this->tag,
            'telegramId' => $this->telegramId,
            'email' => $this->email,
            'hwidDeviceLimit' => $this->hwidDeviceLimit,
            'firstConnectedAt' => $this->firstConnectedAt,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'activeInternalSquads' => array_map(
                fn($squad) => $squad->toArray(),
                $this->activeInternalSquads,
            ),
            'externalSquadUuid' => $this->externalSquadUuid,
            'subscriptionUrl' => $this->subscriptionUrl,
            'lastConnectedNode' => $this->lastConnectedNode?->toArray(),
            'happ' => $this->happ->toArray(),
            'status' => $this->status,
            'trafficLimitBytes' => $this->trafficLimitBytes,
            'trafficLimitStrategy' => $this->trafficLimitStrategy,
            'lastTriggeredThreshold' => $this->lastTriggeredThreshold,
        ];
    }
}
