<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\Enums\InternalSquadMode;

final class HostInternalSquadsDto implements Dto
{
    /**
     * Инициализирует поля HostInternalSquadsDto для обмена данными с Remnawave.
     *
     * @param InternalSquadMode $mode
     * @param string[] $squads
     */
    public function __construct(
        public InternalSquadMode $mode,
        public array $squads,
    ) {}

    /**
     * Создаёт HostInternalSquadsDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     *
     * @throws \ValueError
     */
    public static function fromArray(array $data): static
    {
        return new self(
            mode: InternalSquadMode::from($data['mode']),
            squads: $data['squads'],
        );
    }

    /**
     * Преобразует HostInternalSquadsDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return ['mode' => $this->mode->value, 'squads' => $this->squads];
    }
}
