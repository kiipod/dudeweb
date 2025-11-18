<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;

class LoginResponse implements Dto
{
    /**
     * @param string $accessToken
     */
    public function __construct(
        public string $accessToken,
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
            accessToken: $data['accessToken'],
        );
    }

    /**
     * Метод для преобразования в массив
     *
     * @return string[]
     */
    public function toArray(): array
    {
        return [
            'accessToken' => $this->accessToken,
        ];
    }
}
