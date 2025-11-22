<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class LoginRequestDto implements Dto
{
    /**
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
     * @param array $data
     * @return self
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
     * @return array
     */
    public function toArray(): array
    {
        return [
            'username' => $this->username,
            'password' => $this->password,
        ];
    }
}
