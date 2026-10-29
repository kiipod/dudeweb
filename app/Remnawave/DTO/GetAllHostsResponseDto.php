<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class GetAllHostsResponseDto implements Dto
{
    /**
     * Инициализирует поля GetAllHostsResponseDto для обмена данными с Remnawave.
     *
     * @param array $response
     */
    public function __construct(
        public array $response,
    ) {}

    /**
     * Создаёт GetAllHostsResponseDto из массива полей Remnawave.
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
            response: array_map(
                fn($host) => HostDto::fromArray($host),
                $data['response'],
            ),
        );
    }

    /**
     * Преобразует GetAllHostsResponseDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
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
