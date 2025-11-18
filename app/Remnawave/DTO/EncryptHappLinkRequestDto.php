<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class EncryptHappLinkRequestDto implements Dto
{
    /**
     * @param string $linkToEncrypt
     */
    public function __construct(
        public string $linkToEncrypt,
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
            linkToEncrypt: $data['linkToEncrypt'],
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
            'linkToEncrypt' => $this->linkToEncrypt,
        ];
    }

}
