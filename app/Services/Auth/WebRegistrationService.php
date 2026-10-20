<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\User;
use App\Services\ReferralInviteService;
use App\Services\PromocodeService;
use Illuminate\Support\Str;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

final class WebRegistrationService
{
    /**
     * Принимает общий attribution resolver и существующий discount service.
     *
     * @param ReferralInviteService $invites
     * @param PromocodeService $promocodes
     */
    public function __construct(private readonly ReferralInviteService $invites, private readonly PromocodeService $promocodes) {}

    /**
     * Создаёт независимый web account, ожидающий подтверждения email.
     *
     * @param string $email
     * @param string $password
     * @param string|null $inviteToken
     *
     * @return User
     *
     * @throws UniqueConstraintViolationException
     * @throws ValidationException
     */
    public function create(string $email, #[\SensitiveParameter] string $password, ?string $inviteToken = null): User
    {
        try {
            return DB::transaction(function () use ($email, $password, $inviteToken): User {
                $user = User::query()->create([
                    'email' => $email,
                    'password' => $password,
                    'tags' => UserTags::Inactive,
                    'provisioning_key' => 'web_' . str_replace('-', '', (string) Str::uuid()),
                    'provisioning_state' => ProvisioningState::Pending,
                ]);
                $this->invites->attributeNewUser($user, $inviteToken);
                if ($user->referrer_user_id !== null) {
                    $this->promocodes->createForRefUser($user);
                }
                return $user;
            });
        } catch (UniqueConstraintViolationException $exception) {
            if (User::query()->where('email', $email)->exists()) {
                throw ValidationException::withMessages(['email' => 'Этот email уже используется.']);
            }
            throw $exception;
        }
    }
}
