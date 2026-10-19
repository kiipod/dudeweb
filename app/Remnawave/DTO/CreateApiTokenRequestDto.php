<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

final class CreateApiTokenRequestDto implements Dto
{
    /**
     * Инициализирует поля CreateApiTokenRequestDto для обмена данными с Remnawave.
     *
     * @param string $name
     * @param int $expiresInDays
     * @param string[] $scopes
     *
     * @throws \InvalidArgumentException
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

    /**
     * Создаёт CreateApiTokenRequestDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     *
     * @throws \InvalidArgumentException
     */
    public static function fromArray(array $data): static
    {
        return new self(
            name: $data['name'],
            expiresInDays: $data['expiresInDays'],
            scopes: $data['scopes'] ?? ['*'],
        );
    }

    /**
     * Преобразует CreateApiTokenRequestDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'expiresInDays' => $this->expiresInDays,
            'scopes' => $this->scopes,
        ];
    }
}
