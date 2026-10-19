<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class DeleteUserHwidDeviceRequestDto implements Dto
{
    /**
     * Инициализирует поля DeleteUserHwidDeviceRequestDto для обмена данными с Remnawave.
     *
     * @param int $userId
     * @param string $hwid
     */
    public function __construct(
        public int $userId,
        public string $hwid,
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
            userId: $data['userId'],
            hwid: $data['hwid'],
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
            'userId' => $this->userId,
            'hwid' => $this->hwid,
        ];
    }
}
