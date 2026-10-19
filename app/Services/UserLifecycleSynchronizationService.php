<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Remnawave\DTO\Response\UserResponse;
use App\Remnawave\DTO\Response\UsersStreamResponse;
use App\Remnawave\RemnawaveApi;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;
use UnexpectedValueException;

final readonly class UserLifecycleSynchronizationService
{
    /**
     * Принимает зависимости для работы UserLifecycleSynchronizationService.
     *
     * @param RemnawaveApi $remnawaveApi
     * @param UserStateManager $userStateManager
     */
    public function __construct(
        private RemnawaveApi $remnawaveApi,
        private UserStateManager $userStateManager,
    ) {}

    /**
     * Синхронизирует local tags со всеми доступными пользователями Remnawave.
     *
     * @return array{checked: int, changed: int, failed: int}
     *
     * @throws Throwable
     * @throws UnexpectedValueException
     */
    public function synchronize(): array
    {
        $handler = $this->remnawaveApi->users();
        $cursor = null;
        $visitedCursors = [];
        $totals = $this->emptyResult();

        do {
            $page = $handler->getUsersStream($cursor)->response;
            $totals = $this->mergeResults($totals, $this->processPage($page));

            if (!$page->hasMore) {
                break;
            }

            $cursor = $page->nextCursor;

            if ($cursor === null || in_array($cursor, $visitedCursors, true)) {
                throw new UnexpectedValueException('Remnawave users stream returned an invalid cursor.');
            }

            $visitedCursors[] = $cursor;
        } while (true);

        return $totals;
    }

    /**
     * Согласует локальные состояния пользователей одной страницы Remnawave.
     *
     * @param UsersStreamResponse $page
     *
     * @return array{checked: int, changed: int, failed: int}
     */
    private function processPage(UsersStreamResponse $page): array
    {
        $localUsers = $this->localUsersFor($page->users);
        $byChatId = $localUsers->keyBy('chat_id');
        $byUsername = $localUsers->keyBy('username');
        $result = $this->emptyResult();

        foreach ($page->users as $remoteUser) {
            $user = $remoteUser->telegramId !== null
                ? $byChatId->get($remoteUser->telegramId)
                : $byUsername->get($remoteUser->username);

            if ($user === null) {
                continue;
            }

            try {
                $localTag = $user->tags;
                $targetTag = $this->userStateManager->syncFromRemote($user, $remoteUser);

                $result['checked']++;
                $result['changed'] += (int) (
                    $localTag !== $targetTag || $remoteUser->tag !== $targetTag->value
                );
            } catch (Throwable $exception) {
                $result['failed']++;

                Log::error('User lifecycle synchronization failed.', [
                    'user_id' => $user->id,
                    'remnawave_user_id' => $remoteUser->id,
                    'remnawave_status' => $remoteUser->status->value,
                    'exception' => $exception::class,
                    'code' => $exception->getCode(),
                ]);
            }
        }

        return $result;
    }

    /**
     * Одним запросом сопоставляет удалённых пользователей с локальными аккаунтами.
     *
     * @param list<UserResponse> $remoteUsers
     *
     * @return Collection<int, User>
     */
    private function localUsersFor(array $remoteUsers): Collection
    {
        $chatIds = [];
        $usernames = [];

        foreach ($remoteUsers as $remoteUser) {
            if ($remoteUser->telegramId !== null) {
                $chatIds[] = $remoteUser->telegramId;
            } else {
                $usernames[] = $remoteUser->username;
            }
        }

        if ($chatIds === [] && $usernames === []) {
            return new Collection();
        }

        $query = User::query();

        if ($chatIds !== []) {
            $query->whereIn('chat_id', $chatIds);
        }

        if ($usernames !== []) {
            $chatIds === []
                ? $query->whereIn('username', $usernames)
                : $query->orWhereIn('username', $usernames);
        }

        return $query->get();
    }

    /**
     * Инициализирует счётчики результатов обработки пользователей.
     *
     * @return array{checked: int, changed: int, failed: int}
     */
    private function emptyResult(): array
    {
        return ['checked' => 0, 'changed' => 0, 'failed' => 0];
    }

    /**
     * Суммирует счётчики обработки отдельных страниц.
     *
     * @param array{checked: int, changed: int, failed: int} $left
     * @param array{checked: int, changed: int, failed: int} $right
     *
     * @return array{checked: int, changed: int, failed: int}
     */
    private function mergeResults(array $left, array $right): array
    {
        foreach ($right as $key => $value) {
            $left[$key] += $value;
        }

        return $left;
    }
}
