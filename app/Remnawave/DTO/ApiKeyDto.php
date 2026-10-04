<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class ApiKeyDto implements Dto
{
    /**
     * @param string $uuid
     * @param string[] $scopes
     * @param string $createdAt
     * @param string $updatedAt
     */
    public function __construct(
        public string $uuid,
        public string $name,
        public string $expireAt,
        public array $scopes,
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
            expireAt: $data['expireAt'],
            scopes: $data['scopes'],
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
            'expireAt' => $this->expireAt,
            'scopes' => $this->scopes,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
