<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class GetAllHostsResponseDto implements Dto
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
                fn($host) => HostDto::fromArray($host),
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
                fn($host) => $host->toArray(),
                $this->response,
            ),
        ];
    }
}
