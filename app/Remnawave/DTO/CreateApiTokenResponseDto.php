<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\CreateApiTokenResponse;

class CreateApiTokenResponseDto implements Dto
{
    /**
     * @param CreateApiTokenResponse $response
     */
    public function __construct(
        public CreateApiTokenResponse $response,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: CreateApiTokenResponse::fromArray($data['response']),
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'response' => $this->response->toArray(),
        ];
    }
}
