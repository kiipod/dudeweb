<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class SsConfLinksDto implements Dto
{
    /**
     * @param string $subscriptionUrl
     */
    public function __construct(
        public string $subscriptionUrl,
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
            subscriptionUrl: $data['subscriptionUrl'],
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
            'subscriptionUrl' => $this->subscriptionUrl,
        ];
    }
}
