<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class NodeResponseDto implements Dto
{
    /**
     * Инициализирует поля NodeResponseDto для обмена данными с Remnawave.
     *
     * @param NodeDto $response
     */
    public function __construct(
        public NodeDto $response,
    ) {}

    /**
     * Метод для создания из массива
     *
     * @param array<string, mixed> $data
     *
     * @return static
     *
     * @throws \ValueError
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
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'response' => $this->response->toArray(),
        ];
    }
}
