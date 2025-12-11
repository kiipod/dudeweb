<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;

class DocsResponse implements Dto
{
    /**
     * @param bool $isDocsEnabled
     * @param string|null $scalarPath
     * @param string|null $swaggerPath
     */
    public function __construct(
        public bool $isDocsEnabled,
        public ?string $scalarPath,
        public ?string $swaggerPath,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            isDocsEnabled: $data['isDocsEnabled'],
            scalarPath: $data['scalarPath'] ?? null,
            swaggerPath: $data['swaggerPath'] ?? null,
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'isDocsEnabled' => $this->isDocsEnabled,
            'scalarPath' => $this->scalarPath,
            'swaggerPath' => $this->swaggerPath,
        ];
    }
}
