<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class GetAllNodesResponseDto implements Dto
{
    /**
     * @param array $response
     */
    public function __construct(
        public array $response,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: array_map(
                fn($node) => NodeDto::fromArray($node),
                $data['response'],
            ),
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'response' => array_map(
                fn($node) => $node->toArray(),
                $this->response,
            ),
        ];
    }
}
