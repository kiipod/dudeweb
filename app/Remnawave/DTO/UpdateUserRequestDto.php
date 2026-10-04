<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\Enums\TrafficLimitStrategy;
use App\Remnawave\Enums\UserStatus;

class UpdateUserRequestDto implements Dto
{
    /**
     * @param string|null $username
     * @param int|null $id
     * @param UserStatus|null $status
     * @param int|null $trafficLimitBytes
     * @param TrafficLimitStrategy|null $trafficLimitStrategy
     * @param string|null $expireAt
     * @param string|null $description
     * @param string|null $tag
     * @param int|null $telegramId
     * @param string|null $email
     * @param int|null $hwidDeviceLimit
     * @param array|null $activeInternalSquads
     * @param string|null $externalSquadUuid
     */
    public function __construct(
        public ?string $username = null,
        public ?int $id = null,
        public ?UserStatus $status = null,
        public ?int $trafficLimitBytes = null,
        public ?TrafficLimitStrategy $trafficLimitStrategy = null,
        public ?string $expireAt = null,
        public ?string $description = null,
        public ?string $tag = null,
        public ?int $telegramId = null,
        public ?string $email = null,
        public ?int $hwidDeviceLimit = null,
        public ?array $activeInternalSquads = null,
        public ?string $externalSquadUuid = null,
    ) {
        $this->validate();
    }

    /**
     * Метод для создания из массива
     *
     * @param array $data
     * @return self
     */
    public static function fromArray(array $data): static
    {
        return new self(
            username: $data['username'] ?? null,
            id: $data['id'] ?? null,
            status: isset($data['status']) ? UserStatus::from($data['status']) : null,
            trafficLimitBytes: $data['trafficLimitBytes'] ?? null,
            trafficLimitStrategy: isset($data['trafficLimitStrategy'])
                ? TrafficLimitStrategy::from($data['trafficLimitStrategy'])
                : null,
            expireAt: $data['expireAt'] ?? null,
            description: $data['description'] ?? null,
            tag: $data['tag'] ?? null,
            telegramId: $data['telegramId'] ?? null,
            email: $data['email'] ?? null,
            hwidDeviceLimit: $data['hwidDeviceLimit'] ?? null,
            activeInternalSquads: $data['activeInternalSquads'] ?? null,
            externalSquadUuid: $data['externalSquadUuid'] ?? null,
        );
    }

    /**
     * Метод для преобразования в массив
     *
     * @return array
     */
    public function toArray(): array
    {
        return array_filter([
            'username' => $this->username,
            'id' => $this->id,
            'status' => $this->status?->value,
            'trafficLimitBytes' => $this->trafficLimitBytes,
            'trafficLimitStrategy' => $this->trafficLimitStrategy?->value,
            'expireAt' => $this->expireAt,
            'description' => $this->description,
            'tag' => $this->tag,
            'telegramId' => $this->telegramId,
            'email' => $this->email,
            'hwidDeviceLimit' => $this->hwidDeviceLimit,
            'activeInternalSquads' => $this->activeInternalSquads,
            'externalSquadUuid' => $this->externalSquadUuid,
        ], fn($value) => !is_null($value));
    }

    /**
     * Метод для валидации данных
     *
     * @return void
     */
    private function validate(): void
    {
        // Валидация статуса
        if ($this->status !== null && !in_array($this->status, [UserStatus::Active, UserStatus::Disabled], true)) {
            throw new \InvalidArgumentException('Status must be ACTIVE or DISABLED');
        }

        // Валидация tag
        if ($this->tag && !preg_match('/^[A-Z0-9_]+$/', $this->tag)) {
            throw new \InvalidArgumentException('Tag must contain only uppercase letters, numbers and underscores');
        }

        if ($this->tag && strlen($this->tag) > 16) {
            throw new \InvalidArgumentException('Tag must be maximum 16 characters long');
        }

        // Валидация email
        if ($this->email && !filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Email must be in valid format');
        }

        // Валидация trafficLimitBytes
        if ($this->trafficLimitBytes !== null && $this->trafficLimitBytes < 0) {
            throw new \InvalidArgumentException('Traffic limit bytes must be positive or zero');
        }

        // Валидация hwidDeviceLimit
        if ($this->hwidDeviceLimit !== null && $this->hwidDeviceLimit < 0) {
            throw new \InvalidArgumentException('HWID device limit must be positive or zero');
        }
    }
}
