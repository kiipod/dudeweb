<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

final class NodeVersionsDto implements Dto
{
    /**
     * Инициализирует поля NodeVersionsDto для обмена данными с Remnawave.
     *
     * @param string $xray
     * @param string $node
     */
    public function __construct(public string $xray, public string $node) {}

    /**
     * Создаёт NodeVersionsDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(xray: $data['xray'], node: $data['node']);
    }

    /**
     * Преобразует NodeVersionsDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return ['xray' => $this->xray, 'node' => $this->node];
    }
}
