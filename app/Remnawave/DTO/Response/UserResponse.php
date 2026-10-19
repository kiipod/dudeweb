<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\ActiveInternalSquadDto;
use App\Remnawave\DTO\Dto;
use App\Remnawave\DTO\UserTrafficDto;
use App\Remnawave\Enums\TrafficLimitStrategy;
use App\Remnawave\Enums\UserStatus;

class UserResponse implements Dto
{
    /**
     * Инициализирует поля UserResponse для обмена данными с Remnawave.
     *
     * @param int $id
     * @param string $shortUuid
     * @param string $username
     * @param string $expireAt
     * @param int|null $telegramId
     * @param string|null $email
     * @param string|null $description
     * @param string|null $tag
     * @param int|null $hwidDeviceLimit
     * @param string|null $externalSquadUuid
     * @param string $trojanPassword
     * @param string $vlessUuid
     * @param string $ssPassword
     * @param string|null $subRevokedAt
     * @param string|null $lastTrafficResetAt
     * @param string $createdAt
     * @param string $updatedAt
     * @param string $subscriptionUrl
     * @param array $activeInternalSquads
     * @param UserTrafficDto $userTraffic
     * @param UserStatus $status
     * @param int $trafficLimitBytes
     * @param TrafficLimitStrategy $trafficLimitStrategy
     * @param int $lastTriggeredThreshold
     */
    public function __construct(
        public int $id,
        public string $shortUuid,
        public string $username,
        public string $expireAt,
        public ?int $telegramId,
        public ?string $email,
        public ?string $description,
        public ?string $tag,
        public ?int $hwidDeviceLimit,
        public ?string $externalSquadUuid,
        public string $trojanPassword,
        public string $vlessUuid,
        public string $ssPassword,
        public ?string $subRevokedAt,
        public ?string $lastTrafficResetAt,
        public string $createdAt,
        public string $updatedAt,
        public string $subscriptionUrl,
        public array $activeInternalSquads,
        public UserTrafficDto $userTraffic,
        public UserStatus $status,
        public int $trafficLimitBytes,
        public TrafficLimitStrategy $trafficLimitStrategy,
        public int $lastTriggeredThreshold,
    ) {}

    /**
     * Метод для создания из массива
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
            id: $data['id'],
            shortUuid: $data['shortUuid'],
            username: $data['username'],
            expireAt: $data['expireAt'],
            telegramId: $data['telegramId'] ?? null,
            email: $data['email'] ?? null,
            description: $data['description'] ?? null,
            tag: $data['tag'] ?? null,
            hwidDeviceLimit: $data['hwidDeviceLimit'] ?? null,
            externalSquadUuid: $data['externalSquadUuid'] ?? null,
            trojanPassword: $data['trojanPassword'],
            vlessUuid: $data['vlessUuid'],
            ssPassword: $data['ssPassword'],
            subRevokedAt: $data['subRevokedAt'] ?? null,
            lastTrafficResetAt: $data['lastTrafficResetAt'] ?? null,
            createdAt: $data['createdAt'],
            updatedAt: $data['updatedAt'],
            subscriptionUrl: $data['subscriptionUrl'],
            activeInternalSquads: array_map(
                fn($squad) => ActiveInternalSquadDto::fromArray($squad),
                $data['activeInternalSquads'] ?? [],
            ),
            userTraffic: UserTrafficDto::fromArray($data['userTraffic']),
            status: UserStatus::from($data['status']),
            trafficLimitBytes: $data['trafficLimitBytes'],
            trafficLimitStrategy: TrafficLimitStrategy::from($data['trafficLimitStrategy']),
            lastTriggeredThreshold: $data['lastTriggeredThreshold'],
        );
    }

    /**
     * Метод для преобразования в массив
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'shortUuid' => $this->shortUuid,
            'username' => $this->username,
            'expireAt' => $this->expireAt,
            'telegramId' => $this->telegramId,
            'email' => $this->email,
            'description' => $this->description,
            'tag' => $this->tag,
            'hwidDeviceLimit' => $this->hwidDeviceLimit,
            'externalSquadUuid' => $this->externalSquadUuid,
            'trojanPassword' => $this->trojanPassword,
            'vlessUuid' => $this->vlessUuid,
            'ssPassword' => $this->ssPassword,
            'subRevokedAt' => $this->subRevokedAt,
            'lastTrafficResetAt' => $this->lastTrafficResetAt,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'subscriptionUrl' => $this->subscriptionUrl,
            'activeInternalSquads' => array_map(
                fn($squad) => $squad->toArray(),
                $this->activeInternalSquads,
            ),
            'userTraffic' => $this->userTraffic->toArray(),
            'status' => $this->status->value,
            'trafficLimitBytes' => $this->trafficLimitBytes,
            'trafficLimitStrategy' => $this->trafficLimitStrategy->value,
            'lastTriggeredThreshold' => $this->lastTriggeredThreshold,
        ];
    }
}
