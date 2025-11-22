<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class SubscriptionHappDto implements Dto
{
    /**
     * @param string $cryptoLink
     */
    public function __construct(
        public string $cryptoLink,
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
            cryptoLink: $data['cryptoLink'],
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
            'cryptoLink' => $this->cryptoLink,
        ];
    }
}
