<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\GetAllUsersResponse;

class GetAllUsersResponseDto implements Dto
{
    /**
     * @param GetAllUsersResponse $response
     */
    public function __construct(
        public GetAllUsersResponse $response,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: GetAllUsersResponse::fromArray($data['response']),
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
