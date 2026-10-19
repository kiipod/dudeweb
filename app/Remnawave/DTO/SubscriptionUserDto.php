<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\Enums\TrafficLimitStrategy;
use App\Remnawave\Enums\UserStatus;

class SubscriptionUserDto implements Dto
{
    /**
     * Инициализирует поля SubscriptionUserDto для обмена данными с Remnawave.
     *
     * @param string $shortUuid
     * @param float $daysLeft
     * @param string $trafficUsed
     * @param string $trafficLimit
     * @param string $lifetimeTrafficUsed
     * @param string $trafficUsedBytes
     * @param string $trafficLimitBytes
     * @param string $lifetimeTrafficUsedBytes
     * @param string $username
     * @param string $expiresAt
     * @param bool $isActive
     * @param UserStatus $userStatus
     * @param TrafficLimitStrategy $trafficLimitStrategy
     */
    public function __construct(
        public string $shortUuid,
        public float $daysLeft,
        public string $trafficUsed,
        public string $trafficLimit,
        public string $lifetimeTrafficUsed,
        public string $trafficUsedBytes,
        public string $trafficLimitBytes,
        public string $lifetimeTrafficUsedBytes,
        public string $username,
        public string $expiresAt,
        public bool $isActive,
        public UserStatus $userStatus,
        public TrafficLimitStrategy $trafficLimitStrategy,
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
            shortUuid: $data['shortUuid'],
            daysLeft: $data['daysLeft'],
            trafficUsed: $data['trafficUsed'],
            trafficLimit: $data['trafficLimit'],
            lifetimeTrafficUsed: $data['lifetimeTrafficUsed'],
            trafficUsedBytes: $data['trafficUsedBytes'],
            trafficLimitBytes: $data['trafficLimitBytes'],
            lifetimeTrafficUsedBytes: $data['lifetimeTrafficUsedBytes'],
            username: $data['username'],
            expiresAt: $data['expiresAt'],
            isActive: $data['isActive'],
            userStatus: UserStatus::from($data['userStatus']),
            trafficLimitStrategy: TrafficLimitStrategy::from($data['trafficLimitStrategy']),
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
            'shortUuid' => $this->shortUuid,
            'daysLeft' => $this->daysLeft,
            'trafficUsed' => $this->trafficUsed,
            'trafficLimit' => $this->trafficLimit,
            'lifetimeTrafficUsed' => $this->lifetimeTrafficUsed,
            'trafficUsedBytes' => $this->trafficUsedBytes,
            'trafficLimitBytes' => $this->trafficLimitBytes,
            'lifetimeTrafficUsedBytes' => $this->lifetimeTrafficUsedBytes,
            'username' => $this->username,
            'expiresAt' => $this->expiresAt,
            'isActive' => $this->isActive,
            'userStatus' => $this->userStatus->value,
            'trafficLimitStrategy' => $this->trafficLimitStrategy->value,
        ];
    }
}
