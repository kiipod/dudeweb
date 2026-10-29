<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class HostResponseDto implements Dto
{
    /**
     * Инициализирует поля HostResponseDto для обмена данными с Remnawave.
     *
     * @param HostDto $response
     */
    public function __construct(
        public HostDto $response,
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
            response: HostDto::fromArray($data['response']),
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
