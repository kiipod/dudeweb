<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\SubscriptionResponse;

final class GetSubscriptionByUsernameResponseDto implements Dto
{
    /**
     * Инициализирует поля GetSubscriptionByUsernameResponseDto для обмена данными с Remnawave.
     *
     * @param SubscriptionResponse $response
     */
    public function __construct(
        public SubscriptionResponse $response,
    ) {}

    /**
     * Создаёт GetSubscriptionByUsernameResponseDto из массива полей Remnawave.
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
            response: SubscriptionResponse::fromArray($data['response']),
        );
    }

    /**
     * Преобразует GetSubscriptionByUsernameResponseDto в массив полей для обмена с Remnawave.
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
