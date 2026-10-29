<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class TrafficStatDto implements Dto
{
    /**
     * Инициализирует поля TrafficStatDto для обмена данными с Remnawave.
     *
     * @param string $tag
     * @param string $upload
     * @param string $download
     */
    public function __construct(
        public string $tag,
        public string $upload,
        public string $download,
    ) {}

    /**
     * Создаёт TrafficStatDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            tag: $data['tag'],
            upload: $data['upload'],
            download: $data['download'],
        );
    }

    /**
     * Преобразует TrafficStatDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'tag' => $this->tag,
            'upload' => $this->upload,
            'download' => $this->download,
        ];
    }
}
