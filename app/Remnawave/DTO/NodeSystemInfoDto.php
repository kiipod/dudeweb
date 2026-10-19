<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

final class NodeSystemInfoDto implements Dto
{
    /**
     * Инициализирует поля NodeSystemInfoDto для обмена данными с Remnawave.
     *
     * @param string $arch
     * @param int $cpus
     * @param string $cpuModel
     * @param float $memoryTotal
     * @param string $hostname
     * @param string $platform
     * @param string $release
     * @param string $type
     * @param string $version
     * @param string[] $networkInterfaces
     */
    public function __construct(
        public string $arch,
        public int $cpus,
        public string $cpuModel,
        public float $memoryTotal,
        public string $hostname,
        public string $platform,
        public string $release,
        public string $type,
        public string $version,
        public array $networkInterfaces,
    ) {}

    /**
     * Создаёт NodeSystemInfoDto из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            arch: $data['arch'],
            cpus: $data['cpus'],
            cpuModel: $data['cpuModel'],
            memoryTotal: $data['memoryTotal'],
            hostname: $data['hostname'],
            platform: $data['platform'],
            release: $data['release'],
            type: $data['type'],
            version: $data['version'],
            networkInterfaces: $data['networkInterfaces'],
        );
    }

    /**
     * Преобразует NodeSystemInfoDto в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'arch' => $this->arch,
            'cpus' => $this->cpus,
            'cpuModel' => $this->cpuModel,
            'memoryTotal' => $this->memoryTotal,
            'hostname' => $this->hostname,
            'platform' => $this->platform,
            'release' => $this->release,
            'type' => $this->type,
            'version' => $this->version,
            'networkInterfaces' => $this->networkInterfaces,
        ];
    }
}
