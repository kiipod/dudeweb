<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\SubscriptionResponse;

final class GetSubscriptionByUsernameResponseDto implements Dto
{
    public function __construct(
        public SubscriptionResponse $response,
    ) {}

    public static function fromArray(array $data): static
    {
        return new self(
            response: SubscriptionResponse::fromArray($data['response']),
        );
    }

    public function toArray(): array
    {
        return [
            'response' => $this->response->toArray(),
        ];
    }
}
