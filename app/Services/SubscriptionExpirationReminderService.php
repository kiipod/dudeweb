<?php

declare(strict_types=1);

namespace App\Services;

use App\Bot\Telegram\SubscriptionExpirationNotifier;
use App\Models\User;
use App\Remnawave\DTO\Response\UserResponse;
use App\Remnawave\DTO\Response\UsersStreamResponse;
use App\Remnawave\Enums\UserStatus;
use App\Remnawave\RemnawaveApi;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;
use UnexpectedValueException;

final readonly class SubscriptionExpirationReminderService
{
    /**
     * Принимает зависимости для работы SubscriptionExpirationReminderService.
     *
     * @param RemnawaveApi $remnawaveApi
     * @param SubscriptionExpirationNotifier $notifier
     */
    public function __construct(
        private RemnawaveApi $remnawaveApi,
        private SubscriptionExpirationNotifier $notifier,
    ) {}

    /**
     * Обходит Remnawave и отправляет напоминания о подписках, истекающих в ближайшие сутки.
     *
     * @return array{sent: int, failed: int}
     *
     * @throws Throwable
     * @throws UnexpectedValueException
     */
    public function sendDue(): array
    {
        $handler = $this->remnawaveApi->users();
        $now = CarbonImmutable::instance(now())->utc()->startOfSecond();
        $cursor = null;
        $visitedCursors = [];
        $sent = 0;
        $failed = 0;

        do {
            $page = $handler->getUsersStream($cursor)->response;
            $result = $this->processPage($page, $now);
            $sent += $result['sent'];
            $failed += $result['failed'];

            if (!$page->hasMore) {
                break;
            }

            $cursor = $page->nextCursor;

            if ($cursor === null || in_array($cursor, $visitedCursors, true)) {
                throw new UnexpectedValueException('Remnawave users stream returned an invalid cursor.');
            }

            $visitedCursors[] = $cursor;
        } while (true);

        return ['sent' => $sent, 'failed' => $failed];
    }

    /**
     * Отправляет напоминания подходящим пользователям одной страницы Remnawave.
     *
     * @param UsersStreamResponse $page
     * @param CarbonImmutable $now
     *
     * @return array{sent: int, failed: int}
     */
    private function processPage(UsersStreamResponse $page, CarbonImmutable $now): array
    {
        $dueUsers = [];

        foreach ($page->users as $remoteUser) {
            $expiresAt = $this->expirationForReminder($remoteUser, $now);

            if ($expiresAt !== null) {
                $dueUsers[] = ['remote' => $remoteUser, 'expires_at' => $expiresAt];
            }
        }

        if ($dueUsers === []) {
            return ['sent' => 0, 'failed' => 0];
        }

        $localUsers = $this->localUsersFor($dueUsers);
        $byChatId = $localUsers->keyBy('chat_id');
        $byUsername = $localUsers->keyBy('username');
        $sent = 0;
        $failed = 0;

        foreach ($dueUsers as $dueUser) {
            $remoteUser = $dueUser['remote'];
            $localUser = $remoteUser->telegramId !== null
                ? $byChatId->get($remoteUser->telegramId)
                : $byUsername->get($remoteUser->username);

            if ($localUser === null) {
                continue;
            }

            try {
                if ($this->notifier->notify($localUser, $dueUser['expires_at'])) {
                    $sent++;
                }
            } catch (Throwable $exception) {
                $failed++;

                Log::error('Telegram subscription expiration reminder failed.', [
                    'user_id' => $localUser->id,
                    'remnawave_user_id' => $remoteUser->id,
                    'expires_at' => $dueUser['expires_at']->toISOString(),
                    'exception' => $exception::class,
                    'code' => $exception->getCode(),
                ]);
            }
        }

        return ['sent' => $sent, 'failed' => $failed];
    }

    /**
     * Одним запросом сопоставляет удалённых пользователей с локальными аккаунтами.
     *
     * @param list<array{remote: UserResponse, expires_at: CarbonImmutable}> $dueUsers
     *
     * @return Collection<int, User>
     */
    private function localUsersFor(array $dueUsers): Collection
    {
        $chatIds = [];
        $usernames = [];

        foreach ($dueUsers as $dueUser) {
            if ($dueUser['remote']->telegramId !== null) {
                $chatIds[] = $dueUser['remote']->telegramId;
            } else {
                $usernames[] = $dueUser['remote']->username;
            }
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
     * Возвращает дату окончания, если подписка истекает в ближайшие сутки.
     *
     * @param UserResponse $remoteUser
     * @param CarbonImmutable $now
     *
     * @return CarbonImmutable|null
     */
    private function expirationForReminder(
        UserResponse $remoteUser,
        CarbonImmutable $now,
    ): ?CarbonImmutable {
        if ($remoteUser->status === UserStatus::Expired) {
            return null;
        }

        $expiresAt = CarbonImmutable::parse($remoteUser->expireAt)
            ->utc()
            ->startOfSecond();

        if (!$expiresAt->isAfter($now) || $expiresAt->isAfter($now->addDay())) {
            return null;
        }

        return $expiresAt;
    }
}
