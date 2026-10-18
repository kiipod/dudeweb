<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

final class WebRegistrationService
{
    /**
     * Создаёт независимый web account без Telegram identity или подтверждения email.
     * @param string $email
     * @param string $password
     * @return User
     * @throws UniqueConstraintViolationException
     * @throws ValidationException
     */
    public function create(string $email, #[\SensitiveParameter] string $password): User
    {
        try {
            return DB::transaction(fn(): User => User::query()->create([
                'email' => $email,
                'password' => $password,
                'tags' => UserTags::Inactive,
                'provisioning_key' => 'web_' . str_replace('-', '', (string) Str::uuid()),
                'provisioning_state' => ProvisioningState::Pending,
            ]));
        } catch (UniqueConstraintViolationException $exception) {
            if (User::query()->where('email', $email)->exists()) {
                throw ValidationException::withMessages(['email' => 'Этот email уже используется.']);
            }
            throw $exception;
        }
    }
}
