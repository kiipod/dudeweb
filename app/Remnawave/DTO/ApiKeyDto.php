<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class ApiKeyDto implements Dto
{
    /**
     * @param string $uuid
     * @param string $token
     * @param string $tokenName
     * @param string $createdAt
     * @param string $updatedAt
     */
    public function __construct(
        public string $uuid,
        public string $token,
        public string $tokenName,
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
            token: $data['token'],
            tokenName: $data['tokenName'],
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
            'token' => $this->token,
            'tokenName' => $this->tokenName,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
