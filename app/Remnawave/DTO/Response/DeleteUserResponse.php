<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;

class DeleteUserResponse implements Dto
{
    /**
     * @param bool $isDeleted
     */
    public function __construct(
        public bool $isDeleted,
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
            isDeleted: $data['isDeleted'],
        );
    }

    /**
     * Метод для преобразования в массив
     *
     * @return bool[]
     */
    public function toArray(): array
    {
        return [
            'isDeleted' => $this->isDeleted,
        ];
    }
}
