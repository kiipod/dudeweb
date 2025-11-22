<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\BandwidthPeriodDto;
use App\Remnawave\DTO\Dto;

class BandwidthStatsResponse implements Dto
{
    /**
     * @param BandwidthPeriodDto $bandwidthLastTwoDays
     * @param BandwidthPeriodDto $bandwidthLastSevenDays
     * @param BandwidthPeriodDto $bandwidthLast30Days
     * @param BandwidthPeriodDto $bandwidthCalendarMonth
     * @param BandwidthPeriodDto $bandwidthCurrentYear
     */
    public function __construct(
        public BandwidthPeriodDto $bandwidthLastTwoDays,
        public BandwidthPeriodDto $bandwidthLastSevenDays,
        public BandwidthPeriodDto $bandwidthLast30Days,
        public BandwidthPeriodDto $bandwidthCalendarMonth,
        public BandwidthPeriodDto $bandwidthCurrentYear,
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
            bandwidthLastTwoDays: BandwidthPeriodDto::fromArray($data['bandwidthLastTwoDays']),
            bandwidthLastSevenDays: BandwidthPeriodDto::fromArray($data['bandwidthLastSevenDays']),
            bandwidthLast30Days: BandwidthPeriodDto::fromArray($data['bandwidthLast30Days']),
            bandwidthCalendarMonth: BandwidthPeriodDto::fromArray($data['bandwidthCalendarMonth']),
            bandwidthCurrentYear: BandwidthPeriodDto::fromArray($data['bandwidthCurrentYear']),
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
            'bandwidthLastTwoDays' => $this->bandwidthLastTwoDays->toArray(),
            'bandwidthLastSevenDays' => $this->bandwidthLastSevenDays->toArray(),
            'bandwidthLast30Days' => $this->bandwidthLast30Days->toArray(),
            'bandwidthCalendarMonth' => $this->bandwidthCalendarMonth->toArray(),
            'bandwidthCurrentYear' => $this->bandwidthCurrentYear->toArray(),
        ];
    }
}
