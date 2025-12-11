<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

class NodeMetricsDto implements Dto
{
    /**
     * @param string $nodeUuid
     * @param string $nodeName
     * @param string $countryEmoji
     * @param string $providerName
     * @param float $usersOnline
     * @param array $inboundsStats
     * @param array $outboundsStats
     */
    public function __construct(
        public string $nodeUuid,
        public string $nodeName,
        public string $countryEmoji,
        public string $providerName,
        public float $usersOnline,
        public array $inboundsStats,
        public array $outboundsStats,
    ) {}

    /**
     * @param array $data
     * @return static
     */
    public static function fromArray(array $data): static
    {
        return new self(
            nodeUuid: $data['nodeUuid'],
            nodeName: $data['nodeName'],
            countryEmoji: $data['countryEmoji'],
            providerName: $data['providerName'],
            usersOnline: $data['usersOnline'],
            inboundsStats: array_map(
                fn($stat) => TrafficStatDto::fromArray($stat),
                $data['inboundsStats'] ?? [],
            ),
            outboundsStats: array_map(
                fn($stat) => TrafficStatDto::fromArray($stat),
                $data['outboundsStats'] ?? [],
            ),
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'nodeUuid' => $this->nodeUuid,
            'nodeName' => $this->nodeName,
            'countryEmoji' => $this->countryEmoji,
            'providerName' => $this->providerName,
            'usersOnline' => $this->usersOnline,
            'inboundsStats' => array_map(
                fn($stat) => $stat->toArray(),
                $this->inboundsStats,
            ),
            'outboundsStats' => array_map(
                fn($stat) => $stat->toArray(),
                $this->outboundsStats,
            ),
        ];
    }
}
