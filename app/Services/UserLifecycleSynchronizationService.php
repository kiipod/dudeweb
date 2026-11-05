<?php

declare(strict_types=1);

namespace App\Services;

use App\Remnawave\DTO\Response\UsersStreamResponse;
use App\Remnawave\RemnawaveApi;
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
     * @param RemoteUserMapping $mapping
     */
    public function __construct(
        private RemnawaveApi $remnawaveApi,
        private UserStateManager $userStateManager,
        private RemoteUserMapping $mapping,
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
        $localUsers = $this->mapping->forPage($page->users, []);
        $result = $this->emptyResult();

        foreach ($page->users as $remoteUser) {
            $user = $localUsers->get($remoteUser->id);

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
