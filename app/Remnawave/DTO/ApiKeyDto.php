<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class ApiKeyDto implements Dto
{
    /**
     * Инициализирует поля ApiKeyDto для обмена данными с Remnawave.
     *
     * @param string $uuid
     * @param string $name
     * @param string $expireAt
     * @param string[] $scopes
     * @param string $createdAt
     * @param string $updatedAt
     */
    public function __construct(
        public string $uuid,
        public string $name,
        public string $expireAt,
        public array $scopes,
        public string $createdAt,
        public string $updatedAt,
    ) {}

    /**
     * Создаёт ApiKeyDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            uuid: $data['uuid'],
            name: $data['name'],
            expireAt: $data['expireAt'],
            scopes: $data['scopes'],
            createdAt: $data['createdAt'],
            updatedAt: $data['updatedAt'],
        );
    }

    /**
     * Преобразует ApiKeyDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'expireAt' => $this->expireAt,
            'scopes' => $this->scopes,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
