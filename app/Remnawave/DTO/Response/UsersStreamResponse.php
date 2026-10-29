<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;

final class UsersStreamResponse implements Dto
{
    /**
     * Инициализирует поля UsersStreamResponse для обмена данными с Remnawave.
     *
     * @param list<UserResponse> $users
     * @param string|null $nextCursor
     * @param bool $hasMore
     */
    public function __construct(
        public array $users,
        public ?string $nextCursor,
        public bool $hasMore,
    ) {}

    /**
     * Создаёт UsersStreamResponse из массива полей Remnawave.
     *
     * @param array<string, mixed> $data
     *
     * @return static
     *
     * @throws \ValueError
     */
    public static function fromArray(array $data): static
    {
        return new self(
            users: array_map(
                static fn(array $user): UserResponse => UserResponse::fromArray($user),
                $data['users'],
            ),
            nextCursor: isset($data['nextCursor']) ? (string) $data['nextCursor'] : null,
            hasMore: $data['hasMore'],
        );
    }

    /**
     * Преобразует UsersStreamResponse в массив полей для обмена с Remnawave.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'users' => array_map(
                static fn(UserResponse $user): array => $user->toArray(),
                $this->users,
            ),
            'nextCursor' => $this->nextCursor,
            'hasMore' => $this->hasMore,
        ];
    }
}
