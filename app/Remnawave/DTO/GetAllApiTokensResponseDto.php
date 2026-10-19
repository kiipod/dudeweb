<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\GetAllApiTokensResponse;

class GetAllApiTokensResponseDto implements Dto
{
    /**
     * Инициализирует поля GetAllApiTokensResponseDto для обмена данными с Remnawave.
     *
     * @param GetAllApiTokensResponse $response
     */
    public function __construct(
        public GetAllApiTokensResponse $response,
    ) {}

    /**
     * Создаёт GetAllApiTokensResponseDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: GetAllApiTokensResponse::fromArray($data['response']),
        );
    }

    /**
     * Преобразует GetAllApiTokensResponseDto в массив полей для обмена с Remnawave.
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
