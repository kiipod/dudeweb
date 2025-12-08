<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;

class DeleteApiTokenResponse implements Dto
{
    /**
     * @param bool $response
     */
    public function __construct(
        public bool $response,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: $data['response'],
        );
    }

    /**
     * @return array|boolean
     */
    public function toArray(): array
    {
        return $this->response;
    }
}
