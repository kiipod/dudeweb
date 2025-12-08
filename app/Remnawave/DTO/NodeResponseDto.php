<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class NodeResponseDto implements Dto
{
    /**
     * @param NodeDto $response
     */
    public function __construct(
        public NodeDto $response,
    ) {}

    /**
     * Метод для создания из массива
     *
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: NodeDto::fromArray($data['response']),
        );
    }

    /**
     * Метод для преобразования в массив
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'response' => $this->response->toArray(),
        ];
    }
}
