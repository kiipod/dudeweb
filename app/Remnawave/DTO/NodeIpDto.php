<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\Enums\NodeIpStatus;

final class NodeIpDto implements Dto
{
    /**
     * Инициализирует поля NodeIpDto для обмена данными с Remnawave.
     *
     * @param string $ip
     * @param NodeIpStatus $status
     */
    public function __construct(
        public string $ip,
        public NodeIpStatus $status,
    ) {}

    /**
     * Создаёт NodeIpDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     *
     * @throws \ValueError
     */
    public static function fromArray(array $data): static
    {
        return new self(ip: $data['ip'], status: NodeIpStatus::from($data['status']));
    }

    /**
     * Преобразует NodeIpDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return ['ip' => $this->ip, 'status' => $this->status->value];
    }
}
