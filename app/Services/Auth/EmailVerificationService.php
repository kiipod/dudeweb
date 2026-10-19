<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\User;
use Closure;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class EmailVerificationService
{
    /**
     * @param AuthMailTransport $transport
     * @param Dispatcher $events
     */
    public function __construct(private AuthMailTransport $transport, private Dispatcher $events) {}

    /**
     * @param User $user
     * @return bool
     */
    public function registered(User $user): bool
    {
        return $this->deliver($user, fn() => $this->events->dispatch(new Registered($user)));
    }

    /**
     * @param User $user
     * @return bool
     */
    public function resend(User $user): bool
    {
        return $this->deliver($user, fn() => $user->sendEmailVerificationNotification());
    }

    /**
     * @param User $user
     * @param Closure(): mixed $send
     * @return bool
     */
    private function deliver(User $user, Closure $send): bool
    {
        if ($user->email === null || $user->hasVerifiedEmail() || !$this->transport->available()) {
            return false;
        }

        try {
            $send();

            return true;
        } catch (Throwable $exception) {
            Log::warning('Email verification delivery failed.', ['user_id' => $user->id, 'exception' => $exception::class]);

            return false;
        }
    }
}
