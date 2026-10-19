<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class InternalSquadInfoDto implements Dto
{
    /**
     * Инициализирует поля InternalSquadInfoDto для обмена данными с Remnawave.
     *
     * @param int $membersCount
     * @param int $inboundsCount
     */
    public function __construct(
        public int $membersCount,
        public int $inboundsCount,
    ) {}

    /**
     * Создаёт InternalSquadInfoDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            membersCount: $data['membersCount'],
            inboundsCount: $data['inboundsCount'],
        );
    }

    /**
     * Преобразует InternalSquadInfoDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'membersCount' => $this->membersCount,
            'inboundsCount' => $this->inboundsCount,
        ];
    }
}
