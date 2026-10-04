<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;
use App\Remnawave\DTO\SubscriptionUserDto;

class SubscriptionResponse implements Dto
{
    /**
     * @param bool $isFound
     * @param SubscriptionUserDto $user
     * @param array $links
     * @param array $ssConfLinks
     * @param string $subscriptionUrl
     */
    public function __construct(
        public bool $isFound,
        public SubscriptionUserDto $user,
        public array $links,
        public array $ssConfLinks,
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
            isFound: $data['isFound'],
            user: SubscriptionUserDto::fromArray($data['user']),
            links: $data['links'],
            ssConfLinks: $data['ssConfLinks'],
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
            'isFound' => $this->isFound,
            'user' => $this->user->toArray(),
            'links' => $this->links,
            'ssConfLinks' => $this->ssConfLinks,
            'subscriptionUrl' => $this->subscriptionUrl,
        ];
    }
}
