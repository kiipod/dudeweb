<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\Enums\NodeIpStatus;

final class NodeIpDto implements Dto
{
    public function __construct(
        public string $ip,
        public NodeIpStatus $status,
    ) {}

    public static function fromArray(array $data): static
    {
        return new self(ip: $data['ip'], status: NodeIpStatus::from($data['status']));
    }

    public function toArray(): array
    {
        return ['ip' => $this->ip, 'status' => $this->status->value];
    }
}
