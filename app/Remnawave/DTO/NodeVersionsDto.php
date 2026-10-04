<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

final class NodeVersionsDto implements Dto
{
    public function __construct(public string $xray, public string $node) {}

    public static function fromArray(array $data): static
    {
        return new self(xray: $data['xray'], node: $data['node']);
    }

    public function toArray(): array
    {
        return ['xray' => $this->xray, 'node' => $this->node];
    }
}
