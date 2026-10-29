<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\StatsResponse;

class GetStatsResponseDto implements Dto
{
    /**
     * Инициализирует поля GetStatsResponseDto для обмена данными с Remnawave.
     *
     * @param StatsResponse $response
     */
    public function __construct(
        public StatsResponse $response,
    ) {}

    /**
     * Метод для создания из массива
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: StatsResponse::fromArray($data['response']),
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
