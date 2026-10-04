<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\Enums\InternalSquadMode;

final class HostInternalSquadsDto implements Dto
{
    /** @param string[] $squads */
    public function __construct(
        public InternalSquadMode $mode,
        public array $squads,
    ) {}

    public static function fromArray(array $data): static
    {
        return new self(
            mode: InternalSquadMode::from($data['mode']),
            squads: $data['squads'],
        );
    }

    public function toArray(): array
    {
        return ['mode' => $this->mode->value, 'squads' => $this->squads];
    }
}
