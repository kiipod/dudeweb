<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\UsersStreamResponse;

final class GetUsersStreamResponseDto implements Dto
{
    /**
     * Инициализирует поля GetUsersStreamResponseDto для обмена данными с Remnawave.
     *
     * @param UsersStreamResponse $response
     */
    public function __construct(public UsersStreamResponse $response) {}

    /**
     * Создаёт GetUsersStreamResponseDto из массива полей Remnawave.
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
            response: UsersStreamResponse::fromArray($data['response']),
        );
    }

    /**
     * Преобразует GetUsersStreamResponseDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return ['response' => $this->response->toArray()];
    }
}
