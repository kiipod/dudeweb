<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\NodesMetricsResponse;

class GetNodesMetricsResponseDto implements Dto
{
    /**
     * Инициализирует поля GetNodesMetricsResponseDto для обмена данными с Remnawave.
     *
     * @param NodesMetricsResponse $response
     */
    public function __construct(
        public NodesMetricsResponse $response,
    ) {}

    /**
     * Создаёт GetNodesMetricsResponseDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: NodesMetricsResponse::fromArray($data['response']),
        );
    }

    /**
     * Преобразует GetNodesMetricsResponseDto в массив полей для обмена с Remnawave.
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
