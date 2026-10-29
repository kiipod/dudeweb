<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\CreateApiTokenResponse;

class CreateApiTokenResponseDto implements Dto
{
    /**
     * Инициализирует поля CreateApiTokenResponseDto для обмена данными с Remnawave.
     *
     * @param CreateApiTokenResponse $response
     */
    public function __construct(
        public CreateApiTokenResponse $response,
    ) {}

    /**
     * Создаёт CreateApiTokenResponseDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: CreateApiTokenResponse::fromArray($data['response']),
        );
    }

    /**
     * Преобразует CreateApiTokenResponseDto в массив полей для обмена с Remnawave.
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
