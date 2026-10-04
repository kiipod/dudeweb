<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

final class HostMapperDto implements Dto
{
    public function __construct(
        public array $xrayJson = [],
        public array $mihomo = [],
        public array $base64 = [],
        public array $singbox = [],
    ) {}

    public static function fromArray(array $data): static
    {
        return new self(
            xrayJson: $data['xrayJson'] ?? [],
            mihomo: $data['mihomo'] ?? [],
            base64: $data['base64'] ?? [],
            singbox: $data['singbox'] ?? [],
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'xrayJson' => $this->xrayJson,
            'mihomo' => $this->mihomo,
            'base64' => $this->base64,
            'singbox' => $this->singbox,
        ]);
    }
}
