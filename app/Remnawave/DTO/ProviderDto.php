<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class ProviderDto implements Dto
{
    /**
     * Инициализирует поля ProviderDto для обмена данными с Remnawave.
     *
     * @param string $uuid
     * @param string $name
     * @param string|null $faviconLink
     * @param string|null $loginUrl
     * @param string $createdAt
     * @param string $updatedAt
     */
    public function __construct(
        public string $uuid,
        public string $name,
        public ?string $faviconLink,
        public ?string $loginUrl,
        public string $createdAt,
        public string $updatedAt,
    ) {}

    /**
     * Создаёт ProviderDto из массива полей Remnawave.
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
            faviconLink: $data['faviconLink'] ?? null,
            loginUrl: $data['loginUrl'] ?? null,
            createdAt: $data['createdAt'],
            updatedAt: $data['updatedAt'],
        );
    }

    /**
     * Преобразует ProviderDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'faviconLink' => $this->faviconLink,
            'loginUrl' => $this->loginUrl,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
