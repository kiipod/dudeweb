<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\DTO\Response\GetUserHwidDevicesResponse;

class GetUserHwidDevicesResponseDto implements Dto
{
    /**
     * @param GetUserHwidDevicesResponse $response
     */
    public function __construct(
        public GetUserHwidDevicesResponse $response,
    ) {}

    /**
     * Метод для создания из массива
     *
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            response: GetUserHwidDevicesResponse::fromArray($data['response']),
        );
    }

    /**
     * Метод для преобразования в массив
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'response' => $this->response->toArray(),
        ];
    }
}
