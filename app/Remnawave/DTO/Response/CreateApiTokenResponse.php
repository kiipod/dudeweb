<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;

class CreateApiTokenResponse implements Dto
{
    /**
     * @param string $token
     * @param string $uuid
     */
    public function __construct(
        public string $token,
        public string $uuid,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            token: $data['token'],
            uuid: $data['uuid'],
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'token' => $this->token,
            'uuid' => $this->uuid,
        ];
    }
}
