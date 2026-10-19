<?php

declare(strict_types=1);

namespace App\Services\Account;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\User;
use App\Remnawave\DTO\Response\UserResponse;
use App\Remnawave\Enums\UserStatus;
use App\Remnawave\RemnawaveApi;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Log;
use Throwable;
use UnexpectedValueException;

final readonly class AccountDashboardData
{
    /**
     * Принимает клиент для свежего чтения подписки и устройств владельца.
     *
     * @param RemnawaveApi $api
     */
    public function __construct(private RemnawaveApi $api) {}

    /**
     * Собирает безопасные props без записи provider truth или локального fallback.
     *
     * @param User $user
     *
     * @return array<string, mixed>
     */
    public function forUser(User $user): array
    {
        $identity = ['displayName' => trim((string) $user->first_name)];
        $unavailable = [
            'user' => $identity,
            'subscription' => null,
            'devicesSummary' => null,
            'serviceState' => 'service_error',
            'provisioningRequired' => $user->remnawave_user_id === null,
        ];

        if ($user->remnawave_user_id === null) {
            return $unavailable;
        }

        try {
            $remote = $this->api->users()->withTimeouts(5, 3)
                ->getUserById($user->remnawave_user_id)->response;

            if ($remote->id !== $user->remnawave_user_id) {
                throw new UnexpectedValueException('Remote account identity mismatch.');
            }

            if (trim($remote->expireAt) === '') {
                throw new UnexpectedValueException('Remote expiration is missing.');
            }

            $devices = $this->api->hwid()->withTimeouts(5, 3)
                ->getUserHwidDevices($remote->id)->response;

            if ($devices->total < 0 || array_any($devices->devices, fn($device): bool => $device->userId !== $remote->id)) {
                throw new UnexpectedValueException('Invalid owned device summary.');
            }

            $now = CarbonImmutable::instance(now())->utc();
            $expiresAt = CarbonImmutable::parse($remote->expireAt)->utc();
            $state = $this->state($user, $remote, $expiresAt, $now);
            $planName = $state === DashboardState::Trial
                ? 'Пробный доступ'
                : $user->latestSuccessfulPayment()->with('product.plan')->first()?->product?->plan?->name;

            return [
                'user' => $identity,
                'subscription' => [
                    'state' => $state->value,
                    'planName' => $planName ?? 'Подписка',
                    'expiresAt' => $expiresAt->toIso8601String(),
                    'expiresOn' => $expiresAt->setTimezone(config('app.timezone'))->locale('ru')->isoFormat('D MMMM YYYY'),
                    'remainingDays' => max(0, (int) ceil($now->diffInDays($expiresAt, false))),
                    'url' => $this->subscriptionUrl($remote->subscriptionUrl),
                ],
                'devicesSummary' => [
                    'count' => $devices->total,
                    'limit' => $remote->hwidDeviceLimit > 0 ? $remote->hwidDeviceLimit : null,
                ],
                'serviceState' => 'ready',
                'provisioningRequired' => false,
            ];
        } catch (Throwable $exception) {
            Log::warning('Account dashboard read failed.', [
                'user_id' => $user->id,
                'exception' => $exception::class,
            ]);

            return $unavailable;
        }
    }

    /**
     * Выводит presentation state, сохраняя специальные категории текущего lifecycle.
     *
     * @param User $user
     * @param UserResponse $remote
     * @param CarbonImmutable $expiresAt
     * @param CarbonImmutable $now
     *
     * @return DashboardState
     */
    private function state(
        User $user,
        UserResponse $remote,
        CarbonImmutable $expiresAt,
        CarbonImmutable $now,
    ): DashboardState {
        if (in_array($remote->status, [UserStatus::Limited, UserStatus::Disabled], true)) {
            return DashboardState::Limited;
        }

        if ($remote->status === UserStatus::Expired || !$expiresAt->isAfter($now)) {
            return DashboardState::Expired;
        }

        if (
            $remote->tag === UserTags::Trial->value
            && !in_array($user->tags, [UserTags::Family, UserTags::Friends], true)
        ) {
            return DashboardState::Trial;
        }

        return $expiresAt->isBefore($now->addDays(3)) ? DashboardState::Expiring : DashboardState::Active;
    }

    /**
     * Пропускает только абсолютную HTTP(S)-ссылку без встроенных credentials.
     *
     * @param string $url
     *
     * @return string|null
     */
    private function subscriptionUrl(string $url): ?string
    {
        $parts = parse_url($url);

        return $parts !== false
            && in_array($parts['scheme'] ?? null, ['http', 'https'], true)
            && isset($parts['host'])
            && !isset($parts['user'])
            && !isset($parts['pass'])
            && filter_var($url, FILTER_VALIDATE_URL) !== false
                ? $url
                : null;
    }
}
