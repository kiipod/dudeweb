<?php

declare (strict_types=1);

namespace App\Remnawave\DTO;

class LastConnectedNodeDto implements Dto
{
    /**
     * @param string $connectedAt
     * @param string $nodeName
     * @param string $countryCode
     */
    public function __construct(
        public string $connectedAt,
        public string $nodeName,
        public string $countryCode,
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
            connectedAt: $data['connectedAt'],
            nodeName: $data['nodeName'],
            countryCode: $data['countryCode'],
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
            'connectedAt' => $this->connectedAt,
            'nodeName' => $this->nodeName,
            'countryCode' => $this->countryCode,
        ];
    }
}
