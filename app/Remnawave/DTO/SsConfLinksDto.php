<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class SsConfLinksDto implements Dto
{
    /**
     * @param string|null $propertyName
     */
    public function __construct(
        public ?string $propertyName = null,
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
            propertyName: $data['propertyName'] ?? null,
        );
    }

    /**
     * Метод для преобразования в массив
     *
     * @return string[]
     */
    public function toArray(): array
    {
        $result = [];

        if ($this->propertyName !== null) {
            $result['propertyName'] = $this->propertyName;
        }

        return $result;
    }
}
