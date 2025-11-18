<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;

class EncryptHappLinkResponse implements Dto
{
    /**
     * @param string $encryptedLink
     */
    public function __construct(
        public string $encryptedLink,
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
            encryptedLink: $data['encryptedLink'],
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
            'encryptedLink' => $this->encryptedLink,
        ];
    }
}
