<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class SubscriptionUserDto implements Dto
{
    /**
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
     * @param string $userStatus
     * @param string $trafficLimitStrategy
     * @param array $links
     * @param SsConfLinksDto $ssConfLinks
     * @param string $subscriptionUrl
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
        public string $userStatus,
        public string $trafficLimitStrategy,
        public array $links,
        public SsConfLinksDto $ssConfLinks,
        public string $subscriptionUrl,
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
            userStatus: $data['userStatus'],
            trafficLimitStrategy: $data['trafficLimitStrategy'],
            links: $data['links'],
            ssConfLinks: SsConfLinksDto::fromArray($data['ssConfLinks']),
            subscriptionUrl: $data['subscriptionUrl'],
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
            'userStatus' => $this->userStatus,
            'trafficLimitStrategy' => $this->trafficLimitStrategy,
            'links' => $this->links,
            'ssConfLinks' => $this->ssConfLinks->toArray(),
            'subscriptionUrl' => $this->subscriptionUrl,
        ];
    }
}
