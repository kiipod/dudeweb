<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class TrafficStatDto implements Dto
{
    /**
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
     * @param array $data
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
     * @return array
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
