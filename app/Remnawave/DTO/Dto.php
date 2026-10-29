<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

interface Dto
{
    /**
     * Создаёт DTO из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static;

    /**
     * Преобразует DTO в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array;
}
