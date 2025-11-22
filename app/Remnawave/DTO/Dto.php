<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

interface Dto
{
    public static function fromArray(array $data): static;

    public function toArray(): array;
}
