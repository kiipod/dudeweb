<?php

declare(strict_types=1);

namespace App\Remnawave\DTO;

use App\Remnawave\Enums\TrafficLimitStrategy;
use App\Remnawave\Enums\UserStatus;

class CreateUserRequestDto implements Dto
{
    /**
     * Инициализирует поля CreateUserRequestDto для обмена данными с Remnawave.
     *
     * @param string $username
     * @param string $expireAt
     * @param UserStatus|null $status
     * @param string|null $shortUuid
     * @param string|null $trojanPassword
     * @param string|null $vlessUuid
     * @param string|null $ssPassword
     * @param int|null $trafficLimitBytes
     * @param TrafficLimitStrategy|null $trafficLimitStrategy
     * @param string|null $createdAt
     * @param string|null $lastTrafficResetAt
     * @param string|null $description
     * @param string|null $tag
     * @param int|null $telegramId
     * @param string|null $email
     * @param int|null $hwidDeviceLimit
     * @param array|null $activeInternalSquads
     * @param string|null $externalSquadUuid
     *
     * @throws \InvalidArgumentException
     */
    public function __construct(
        public string $username,
        public string $expireAt,
        public ?UserStatus $status = UserStatus::Active,
        public ?string $shortUuid = null,
        public ?string $trojanPassword = null,
        public ?string $vlessUuid = null,
        public ?string $ssPassword = null,
        public ?int $trafficLimitBytes = null,
        public ?TrafficLimitStrategy $trafficLimitStrategy = TrafficLimitStrategy::NoReset,
        public ?string $createdAt = null,
        public ?string $lastTrafficResetAt = null,
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
     * @param array<string, mixed> $data
     *
     * @return static
     *
     * @throws \InvalidArgumentException
     * @throws \ValueError
     */
    public static function fromArray(array $data): static
    {
        return new self(
            username: $data['username'],
            expireAt: $data['expireAt'],
            status: isset($data['status']) ? UserStatus::from($data['status']) : UserStatus::Active,
            shortUuid: $data['shortUuid'] ?? null,
            trojanPassword: $data['trojanPassword'] ?? null,
            vlessUuid: $data['vlessUuid'] ?? null,
            ssPassword: $data['ssPassword'] ?? null,
            trafficLimitBytes: $data['trafficLimitBytes'] ?? null,
            trafficLimitStrategy: isset($data['trafficLimitStrategy'])
                ? TrafficLimitStrategy::from($data['trafficLimitStrategy'])
                : TrafficLimitStrategy::NoReset,
            createdAt: $data['createdAt'] ?? null,
            lastTrafficResetAt: $data['lastTrafficResetAt'] ?? null,
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
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return array_filter([
            'username' => $this->username,
            'expireAt' => $this->expireAt,
            'status' => $this->status?->value,
            'shortUuid' => $this->shortUuid,
            'trojanPassword' => $this->trojanPassword,
            'vlessUuid' => $this->vlessUuid,
            'ssPassword' => $this->ssPassword,
            'trafficLimitBytes' => $this->trafficLimitBytes,
            'trafficLimitStrategy' => $this->trafficLimitStrategy?->value,
            'createdAt' => $this->createdAt,
            'lastTrafficResetAt' => $this->lastTrafficResetAt,
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
     *
     * @throws \InvalidArgumentException
     */
    private function validate(): void
    {
        // Валидация username
        if (!preg_match('/^[a-zA-Z0-9_-]+$/', $this->username)) {
            throw new \InvalidArgumentException('Username must contain only letters, numbers, underscores and dashes');
        }

        if (strlen($this->username) < 3 || strlen($this->username) > 36) {
            throw new \InvalidArgumentException('Username must be 3-36 characters long');
        }

        // Валидация паролей
        if ($this->trojanPassword && (strlen($this->trojanPassword) < 8 || strlen($this->trojanPassword) > 32)) {
            throw new \InvalidArgumentException('Trojan password must be 8-32 characters long');
        }

        if ($this->ssPassword && (strlen($this->ssPassword) < 8 || strlen($this->ssPassword) > 32)) {
            throw new \InvalidArgumentException('Shadowsocks password must be 8-32 characters long');
        }

        // Валидация UUID
        if ($this->vlessUuid && !preg_match(
            '/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i',
            $this->vlessUuid,
        )) {
            throw new \InvalidArgumentException('VLESS UUID must be in valid UUID format');
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
