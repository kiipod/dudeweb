<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class Pm2StatDto implements Dto
{
    /**
     * @param string $name
     * @param string $memory
     * @param string $cpu
     */
    public function __construct(
        public string $name,
        public string $memory,
        public string $cpu,
    ) {}

    /**
     * Метод для создания из массива
     *
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            name: $data['name'],
            memory: $data['memory'],
            cpu: $data['cpu'],
        );
    }

    /**
     * Метод для преобразования в массив
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'memory' => $this->memory,
            'cpu' => $this->cpu,
        ];
    }
}
