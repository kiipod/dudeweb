<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\InternalSquadDetailResponse;

class GetInternalSquadByUuidResponseDto implements Dto
{
    /**
     * @param InternalSquadDetailResponse $response
     */
    public function __construct(
        public InternalSquadDetailResponse $response,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: InternalSquadDetailResponse::fromArray($data['response']),
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
