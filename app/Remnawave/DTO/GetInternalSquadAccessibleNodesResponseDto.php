<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\InternalSquadAccessibleNodeResponse;

class GetInternalSquadAccessibleNodesResponseDto implements Dto
{
    /**
     * Инициализирует поля GetInternalSquadAccessibleNodesResponseDto для обмена данными с Remnawave.
     *
     * @param InternalSquadAccessibleNodeResponse $response
     */
    public function __construct(
        public InternalSquadAccessibleNodeResponse $response,
    ) {}

    /**
     * Создаёт GetInternalSquadAccessibleNodesResponseDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: InternalSquadAccessibleNodeResponse::fromArray($data['response']),
        );
    }

    /**
     * Преобразует GetInternalSquadAccessibleNodesResponseDto в массив полей для обмена с Remnawave.
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
