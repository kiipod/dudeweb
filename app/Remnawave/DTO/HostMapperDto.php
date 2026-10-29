<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

final class HostMapperDto implements Dto
{
    /**
     * Инициализирует поля HostMapperDto для обмена данными с Remnawave.
     *
     * @param array $xrayJson
     * @param array $mihomo
     * @param array $base64
     * @param array $singbox
     */
    public function __construct(
        public array $xrayJson = [],
        public array $mihomo = [],
        public array $base64 = [],
        public array $singbox = [],
    ) {}

    /**
     * Создаёт HostMapperDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            xrayJson: $data['xrayJson'] ?? [],
            mihomo: $data['mihomo'] ?? [],
            base64: $data['base64'] ?? [],
            singbox: $data['singbox'] ?? [],
        );
    }

    /**
     * Преобразует HostMapperDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
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
