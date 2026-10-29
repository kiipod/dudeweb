<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class LoginRequestDto implements Dto
{
    /**
     * Инициализирует поля LoginRequestDto для обмена данными с Remnawave.
     *
     * @param string $username
     * @param string $password
     */
    public function __construct(
        public string $username,
        public string $password,
    ) {}

    /**
     * Метод для создания из массива
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            username: $data['username'],
            password: $data['password'],
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
            'username' => $this->username,
            'password' => $this->password,
        ];
    }
}
