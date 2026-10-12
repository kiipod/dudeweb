<?php

declare(strict_types=1);

namespace App\Remnawave\DTO\Response;

use App\Remnawave\DTO\Dto;

final class UsersStreamResponse implements Dto
{
    /**
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
     * @param array $data
     * @return static
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
     * @return array
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
