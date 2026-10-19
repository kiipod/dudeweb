<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\User;
use App\Remnawave\DTO\CreateUserRequestDto;
use App\Remnawave\DTO\Response\UserResponse;
use App\Remnawave\Exceptions\ApiException;
use App\Remnawave\RemnawaveApi;
use App\Services\UserStateManager;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Cache\LockTimeoutException;
use RuntimeException;
use Throwable;

final readonly class WebAccountProvisioner
{
    /**
     * Принимает зависимости для работы WebAccountProvisioner.
     *
     * @param RemnawaveApi $api
     * @param UserStateManager $states
     */
    public function __construct(private RemnawaveApi $api, private UserStateManager $states) {}

    /**
     * Восстанавливает результат неоднозначного POST по одному сохранённому ключу.
     *
     * @param User $user
     *
     * @return bool
     */
    public function provision(User $user): bool
    {
        try {
            return Cache::lock('web-provisioning:' . $user->id, 120)->block(5, function () use ($user): bool {
                $user->refresh();
                if ($user->email === null || !$user->hasVerifiedEmail()) {
                    return false;
                }
                if ($user->remnawave_user_id !== null) {
                    return true;
                }
                if ($user->email === null || $user->provisioning_key === null) {
                    throw new RuntimeException('Web provisioning requires an owned identity and durable key.');
                }
                try {
                    $remote = $this->api->users()->getUserByUsername($user->provisioning_key)->response;
                } catch (ApiException $exception) {
                    if ($exception->getCode() !== 404) {
                        throw $exception;
                    }
                    $remote = $this->api->users()->create(new CreateUserRequestDto(
                        username: $user->provisioning_key,
                        expireAt: $user->email_verified_at->copy()->addDays(3)->utc()->toISOString(),
                        trafficLimitBytes: 32212254720,
                        tag: 'TRIAL',
                        email: $user->email,
                        activeInternalSquads: ['4bb28df7-6c1b-4994-8864-52683bb5e144'],
                    ))->response;
                }
                $this->confirmOwnership($user, $remote);
                $this->states->syncFromRemote($user, $remote);
                $user->forceFill([
                    'remnawave_user_id' => $remote->id,
                    'provisioning_state' => ProvisioningState::Ready,
                ])->save();
                return true;
            });
        } catch (LockTimeoutException) {
            return false;
        } catch (Throwable $exception) {
            Log::warning(
                'Web account provisioning failed.',
                ['user_id' => $user->id, 'exception' => $exception::class],
            );
            User::query()->whereKey($user->id)->whereNull('remnawave_user_id')
                ->update(['provisioning_state' => ProvisioningState::ServiceError->value]);
            return false;
        }
    }

    /**
     * Проверяет принадлежность найденного удалённого аккаунта локальному пользователю.
     *
     * @param User $user
     * @param UserResponse $remote
     *
     * @return void
     *
     * @throws RuntimeException
     */
    private function confirmOwnership(User $user, UserResponse $remote): void
    {
        if (
            $remote->id < 1
            || $remote->username !== $user->provisioning_key
            || $remote->email !== $user->email
            || $remote->telegramId !== null
        ) {
            throw new RuntimeException('Remote provisioning identity conflict.');
        }
    }
}
