<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class DeleteUserHwidDeviceRequestDto implements Dto
{
    /**
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
     * @param array $data
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
     * @return array
     */
    public function toArray(): array
    {
        return [
            'userId' => $this->userId,
            'hwid' => $this->hwid,
        ];
    }
}
