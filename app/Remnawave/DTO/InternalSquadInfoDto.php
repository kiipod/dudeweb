<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class InternalSquadInfoDto implements Dto
{
    /**
     * @param int $membersCount
     * @param int $inboundsCount
     */
    public function __construct(
        public int $membersCount,
        public int $inboundsCount,
    ) {}

    /**
     * @param array $data
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
     * @return array
     */
    public function toArray(): array
    {
        return [
            'membersCount' => $this->membersCount,
            'inboundsCount' => $this->inboundsCount,
        ];
    }
}
