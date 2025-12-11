<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\DeleteApiTokenResponse;

class DeleteApiTokenResponseDto implements Dto
{
    /**
     * @param DeleteApiTokenResponse $response
     */
    public function __construct(
        public DeleteApiTokenResponse $response,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: DeleteApiTokenResponse::fromArray($data['response']),
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
