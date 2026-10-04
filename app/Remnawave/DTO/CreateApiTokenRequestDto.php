<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

final class CreateApiTokenRequestDto implements Dto
{
    /**
     * @param string[] $scopes
     */
    public function __construct(
        public string $name,
        public int $expiresInDays,
        public array $scopes = ['*'],
    ) {
        if (strlen($this->name) < 2 || strlen($this->name) > 30) {
            throw new \InvalidArgumentException('Token name must be 2-30 characters long');
        }

        if ($this->expiresInDays < 1) {
            throw new \InvalidArgumentException('Token expiration must be at least one day');
        }
    }

    public static function fromArray(array $data): static
    {
        return new self(
            name: $data['name'],
            expiresInDays: $data['expiresInDays'],
            scopes: $data['scopes'] ?? ['*'],
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'expiresInDays' => $this->expiresInDays,
            'scopes' => $this->scopes,
        ];
    }
}
