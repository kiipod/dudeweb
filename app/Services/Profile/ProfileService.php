<?php

declare(strict_types=1);

namespace App\Services\Profile;

use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProfileService
{
    /**
     * Меняет только own name/email; sensitive checks повторяются под row lock.
     *
     * @param User $actor
     * @param array<string, mixed> $data
     *
     * @return User
     *
     * @throws \Throwable
     */
    public function update(User $actor, #[\SensitiveParameter] array $data): User
    {
        try {
            return DB::transaction(function () use ($actor, $data): User {
                $user = User::query()->lockForUpdate()->findOrFail($actor->id);
                Gate::forUser($user)->authorize('update-account-profile');
                if ($user->email !== $data['email']) {
                    $this->checkPassword($user, $data['current_password'] ?? '');
                    if ($user->remnawave_user_id === null) {
                        throw ValidationException::withMessages(['email' => 'Сначала заверши настройку подключения в личном кабинете.']);
                    }
                    $this->rotateCredentials($user, $data['current_password']);
                    $this->clearResetTokens([$user->email, $data['email']]);
                    $user->email_verified_at = null;
                }
                $user->fill([
                    'first_name' => array_key_exists('first_name', $data) ? $data['first_name'] : $user->first_name,
                    'last_name' => array_key_exists('last_name', $data) ? $data['last_name'] : $user->last_name,
                    'email' => $data['email'],
                ])->save();
                return $user;
            });
        } catch (UniqueConstraintViolationException) {
            throw ValidationException::withMessages(['email' => 'Этот email уже используется.']);
        }
    }

    /**
     * Меняет password и отзывает остальные sessions/remember credentials.
     *
     * @param User $actor
     * @param string $current
     * @param string $password
     *
     * @return User
     *
     * @throws \Throwable
     */
    public function password(User $actor, #[\SensitiveParameter] string $current, #[\SensitiveParameter] string $password): User
    {
        return DB::transaction(function () use ($actor, $current, $password): User {
            $user = User::query()->lockForUpdate()->findOrFail($actor->id);
            Gate::forUser($user)->authorize('secure-account-profile');
            $this->checkPassword($user, $current);
            $this->rotateCredentials($user, $password);
            $this->clearResetTokens([$user->email]);
            $user->save();
            return $user;
        });
    }

    /**
     * Сохраняет пароль по значению, но меняет hash/token для auth.session boundary.
     *
     * @param User $actor
     * @param string $current
     *
     * @return User
     *
     * @throws \Throwable
     */
    public function endOtherSessions(User $actor, #[\SensitiveParameter] string $current): User
    {
        return $this->password($actor, $current, $current);
    }

    /**
     * Повторно проверяет пароль после получения блокировки пользователя.
     *
     * @param User $user
     * @param string $password
     *
     * @return void
     *
     * @throws ValidationException
     */
    private function checkPassword(User $user, #[\SensitiveParameter] string $password): void
    {
        if ($user->password === null || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages(['current_password' => 'Текущий пароль не совпадает.']);
        }
    }

    /**
     * Принудительно меняет hash даже при прежнем plaintext и отзывает remember token.
     *
     * @param User $user
     * @param string $password
     *
     * @return void
     */
    private function rotateCredentials(User $user, #[\SensitiveParameter] string $password): void
    {
        $user->forceFill(['password' => Hash::make($password), 'remember_token' => Str::random(60)]);
    }

    /**
     * Отзывает reset links, выпущенные до sensitive изменения identity.
     *
     * @param array<int, string|null> $emails
     *
     * @return void
     */
    private function clearResetTokens(array $emails): void
    {
        DB::table('password_reset_tokens')->whereIn('email', array_filter($emails))->delete();
    }
}
