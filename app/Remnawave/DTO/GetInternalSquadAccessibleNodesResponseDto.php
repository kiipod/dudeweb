<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\InternalSquadAccessibleNodeResponse;

class GetInternalSquadAccessibleNodesResponseDto implements Dto
{
    /**
     * @param InternalSquadAccessibleNodeResponse $response
     */
    public function __construct(
        public InternalSquadAccessibleNodeResponse $response,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: InternalSquadAccessibleNodeResponse::fromArray($data['response']),
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
