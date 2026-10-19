<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\UserResponse;

class GetUserResponseDto implements Dto
{
    /**
     * Инициализирует поля GetUserResponseDto для обмена данными с Remnawave.
     *
     * @param UserResponse $response
     */
    public function __construct(
        public UserResponse $response,
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
            response: UserResponse::fromArray($data['response']),
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
