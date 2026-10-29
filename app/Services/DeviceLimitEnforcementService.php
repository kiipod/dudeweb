<?php

declare(strict_types=1);

namespace App\Services;

use App\Bot\Telegram\DeviceLimitNotifier;
use App\Models\Plan;
use App\Models\User;
use App\Remnawave\DTO\Response\UserResponse;
use App\Remnawave\DTO\Response\UsersStreamResponse;
use App\Remnawave\Enums\UserStatus;
use App\Remnawave\RemnawaveApi;
use Illuminate\Support\Facades\Log;
use Throwable;
use App\Remnawave\Exceptions\ApiException;
use Illuminate\Support\Facades\Cache;
use UnexpectedValueException;

final readonly class DeviceLimitEnforcementService
{
    /**
     * Принимает зависимости для работы DeviceLimitEnforcementService.
     *
     * @param RemnawaveApi $remnawaveApi
     * @param UserStateManager $userStateManager
     * @param DeviceLimitNotifier $notifier
     * @param RemoteUserMapping $mapping
     */
    public function __construct(
        private RemnawaveApi $remnawaveApi,
        private UserStateManager $userStateManager,
        private DeviceLimitNotifier $notifier,
        private RemoteUserMapping $mapping,
    ) {}

    /**
     * Проверяет лимиты устройств для актуальных пользователей Remnawave.
     *
     * @return array{checked: int, disabled: int, recovered: int, notified: int, failed: int}
     *
     * @throws Throwable
     * @throws UnexpectedValueException
     */
    public function enforce(): array
    {
        if (Cache::has($this->cooldownKey())) {
            return [...$this->emptyResult(), 'failed' => 1];
        }
        $handler = $this->remnawaveApi->users();
        $cursor = null;
        $visitedCursors = [];
        $totals = $this->emptyResult();

        do {
            $page = $handler->getUsersStream($cursor)->response;
            $totals = $this->mergeResults($totals, $this->processPage($page));

            if (Cache::has($this->cooldownKey()) || !$page->hasMore) {
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
     * Scopes the provider cooldown independently of users and secrets.
     *
     * @return string
     */
    private function cooldownKey(): string
    {
        return 'remnawave:hwid:cooldown:' . hash('sha256', (string) config('services.remnawave.api_url'));
    }

    /**
     * Восстанавливает доступ сразу после удаления лишнего устройства.
     *
     * @param User $user
     * @param UserResponse $remoteUser
     * @param int $deviceCount
     *
     * @return bool
     *
     * @throws Throwable
     */
    public function recoverAfterDeviceRemoval(
        User $user,
        UserResponse $remoteUser,
        int $deviceCount,
    ): bool {
        $plan = $this->currentPlan($user);

        if ($plan === null || $deviceCount > $plan->device_limit) {
            return false;
        }

        return $this->recover($user, $remoteUser);
    }

    /**
     * Проверяет лимиты устройств для пользователей одной страницы Remnawave.
     *
     * @param UsersStreamResponse $page
     *
     * @return array{checked: int, disabled: int, recovered: int, notified: int, failed: int}
     */
    private function processPage(UsersStreamResponse $page): array
    {
        $localUsers = $this->mapping->forPage($page->users, ['latestSuccessfulPayment.product.plan']);
        $result = $this->emptyResult();

        foreach ($page->users as $remoteUser) {
            $user = $localUsers->get($remoteUser->id);

            if ($user === null || !$this->shouldCheck($user, $remoteUser)) {
                continue;
            }

            $plan = $this->currentPlan($user);

            if ($plan === null) {
                continue;
            }

            try {
                $deviceCount = $this->remnawaveApi
                    ->hwid()
                    ->getUserHwidDevices($remoteUser->id)
                    ->response
                    ->total;

                $outcome = $this->reconcile(
                    $user,
                    $remoteUser,
                    $deviceCount,
                    $plan->device_limit,
                );

                $result['checked']++;
                $result['disabled'] += (int) $outcome['disabled'];
                $result['recovered'] += (int) $outcome['recovered'];
                $result['notified'] += (int) $outcome['notified'];
            } catch (Throwable $exception) {
                $result['failed']++;

                if ($exception instanceof ApiException && $exception->getCode() === 429) {
                    $seconds = $exception->retryAfterSeconds ?? 60;
                    Cache::put($this->cooldownKey(), true, $seconds);
                    Log::warning('Device enforcement deferred by provider rate limit.', ['retry_after_seconds' => $seconds]);
                    break;
                }
                Log::error('Device limit enforcement failed.', [
                    'user_id' => $user->id,
                    'remnawave_user_id' => $remoteUser->id,
                    'plan_id' => $plan->id,
                    'device_limit' => $plan->device_limit,
                    'exception' => $exception::class,
                    'code' => $exception->getCode(),
                ]);
            }
        }

        return $result;
    }

    /**
     * Согласует состояние подписки с текущим количеством устройств и лимитом тарифа.
     *
     * @param User $user
     * @param UserResponse $remoteUser
     * @param int $deviceCount
     * @param int $deviceLimit
     *
     * @return array{disabled: bool, recovered: bool, notified: bool}
     *
     * @throws Throwable
     */
    private function reconcile(
        User $user,
        UserResponse $remoteUser,
        int $deviceCount,
        int $deviceLimit,
    ): array {
        if ($deviceCount <= $deviceLimit) {
            return [
                'disabled' => false,
                'recovered' => $this->recover($user, $remoteUser),
                'notified' => false,
            ];
        }

        if ($remoteUser->status === UserStatus::Disabled) {
            return [
                'disabled' => false,
                'recovered' => false,
                'notified' => $user->device_limit_exceeded_at !== null
                    && $this->notifier->notify($user, $deviceCount, $deviceLimit),
            ];
        }

        if (!in_array($remoteUser->status, [UserStatus::Active, UserStatus::Limited], true)) {
            return ['disabled' => false, 'recovered' => false, 'notified' => false];
        }

        if ($user->device_limit_exceeded_at === null) {
            $user->update([
                'device_limit_exceeded_at' => now(),
                'device_limit_notification_sent_at' => null,
            ]);
        }

        $this->userStateManager->disableForDeviceLimit($remoteUser);

        return [
            'disabled' => true,
            'recovered' => false,
            'notified' => $this->notifier->notify($user, $deviceCount, $deviceLimit),
        ];
    }

    /**
     * Восстанавливает доступ после устранения превышения лимита устройств.
     *
     * @param User $user
     * @param UserResponse $remoteUser
     *
     * @return bool
     *
     * @throws Throwable
     */
    private function recover(User $user, UserResponse $remoteUser): bool
    {
        if ($user->device_limit_exceeded_at === null) {
            return false;
        }

        if ($remoteUser->status === UserStatus::Disabled) {
            $this->userStateManager->enableAfterDeviceLimitRecovery($remoteUser);
        } elseif ($remoteUser->status !== UserStatus::Active) {
            return false;
        }

        $user->update([
            'device_limit_exceeded_at' => null,
            'device_limit_notification_sent_at' => null,
        ]);

        return true;
    }

    /**
     * Выбирает активных пользователей и аккаунты, отключённые из-за лимита устройств.
     *
     * @param User $user
     * @param UserResponse $remoteUser
     *
     * @return bool
     */
    private function shouldCheck(User $user, UserResponse $remoteUser): bool
    {
        if (in_array($remoteUser->status, [UserStatus::Active, UserStatus::Limited], true)) {
            return true;
        }

        return $remoteUser->status === UserStatus::Disabled
            && $user->device_limit_exceeded_at !== null;
    }

    /**
     * Находит тариф последней успешной покупки пользователя.
     *
     * @param User $user
     *
     * @return Plan|null
     */
    private function currentPlan(User $user): ?Plan
    {
        $user->loadMissing('latestSuccessfulPayment.product.plan');

        return $user->latestSuccessfulPayment?->product?->plan;
    }

    /**
     * Инициализирует счётчики результатов обработки пользователей.
     *
     * @return array{checked: int, disabled: int, recovered: int, notified: int, failed: int}
     */
    private function emptyResult(): array
    {
        return [
            'checked' => 0,
            'disabled' => 0,
            'recovered' => 0,
            'notified' => 0,
            'failed' => 0,
        ];
    }

    /**
     * Суммирует счётчики обработки отдельных страниц.
     *
     * @param array{checked: int, disabled: int, recovered: int, notified: int, failed: int} $left
     * @param array{checked: int, disabled: int, recovered: int, notified: int, failed: int} $right
     *
     * @return array{checked: int, disabled: int, recovered: int, notified: int, failed: int}
     */
    private function mergeResults(array $left, array $right): array
    {
        foreach ($right as $key => $value) {
            $left[$key] += $value;
        }

        return $left;
    }
}
