<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\NodesMetricsResponse;

class GetNodesMetricsResponseDto implements Dto
{
    /**
     * @param NodesMetricsResponse $response
     */
    public function __construct(
        public NodesMetricsResponse $response,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: NodesMetricsResponse::fromArray($data['response']),
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
