<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\InternalSquadDetailResponse;

class GetInternalSquadByUuidResponseDto implements Dto
{
    /**
     * Инициализирует поля GetInternalSquadByUuidResponseDto для обмена данными с Remnawave.
     *
     * @param InternalSquadDetailResponse $response
     */
    public function __construct(
        public InternalSquadDetailResponse $response,
    ) {}

    /**
     * Создаёт GetInternalSquadByUuidResponseDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: InternalSquadDetailResponse::fromArray($data['response']),
        );
    }

    /**
     * Преобразует GetInternalSquadByUuidResponseDto в массив полей для обмена с Remnawave.
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
