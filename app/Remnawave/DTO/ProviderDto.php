<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class ProviderDto implements Dto
{
    /**
     * @param string $uuid
     * @param string $name
     * @param string $faviconLink
     * @param string $loginUrl
     * @param string $createdAt
     * @param string $updatedAt
     */
    public function __construct(
        public string $uuid,
        public string $name,
        public string $faviconLink,
        public string $loginUrl,
        public string $createdAt,
        public string $updatedAt,
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
            faviconLink: $data['faviconLink'],
            loginUrl: $data['loginUrl'],
            createdAt: $data['createdAt'],
            updatedAt: $data['updatedAt'],
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'faviconLink' => $this->faviconLink,
            'loginUrl' => $this->loginUrl,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
