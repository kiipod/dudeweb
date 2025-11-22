<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class ActiveInternalSquadDto implements Dto
{
    /**
     * @param string $uuid
     * @param string $name
     */
    public function __construct(
        public string $uuid,
        public string $name,
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
            uuid: $data['uuid'],
            name: $data['name'],
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
            'uuid' => $this->uuid,
            'name' => $this->name,
        ];
    }
}
