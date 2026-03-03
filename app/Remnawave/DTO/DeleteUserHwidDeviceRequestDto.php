<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class DeleteUserHwidDeviceRequestDto implements Dto
{
    /**
     * @param string $userUuid
     * @param string $hwid
     */
    public function __construct(
        public string $userUuid,
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
            userUuid: $data['userUuid'],
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
            'userUuid' => $this->userUuid,
            'hwid' => $this->hwid,
        ];
    }
}
