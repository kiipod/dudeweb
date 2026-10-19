<?php

declare(strict_types=1);

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Throwable;

final class PasswordRecoveryService
{
    /** @param AuthMailTransport $transport */
    public function __construct(private readonly AuthMailTransport $transport) {}

    /**
     * @param string $email
     * @return void
     * @throws ValidationException
     */
    public function sendLink(string $email): void
    {
        if (!$this->deliveryAvailable()) {
            throw ValidationException::withMessages(['form' => 'Сейчас не удалось отправить письмо. Попробуй позже или напиши в поддержку.']);
        }
        try {
            Password::broker('users')->sendResetLink(['email' => $email]);
        } catch (Throwable $exception) {
            Log::warning('Password recovery delivery failed.', ['exception' => $exception::class]);
            // Per-recipient failures must not disclose whether the address exists.
            // The UI confirms only the request, never successful delivery.
        }
    }

    /**
     * @param array{email: string, password: string, token: string} $credentials
     * @return void
     * @throws ValidationException
     */
    public function reset(#[\SensitiveParameter] array $credentials): void
    {
        $status = Password::broker('users')->reset($credentials, static function (User $user, string $password): void {
            $user->forceFill(['password' => $password, 'remember_token' => Str::random(60)])->save();
            event(new PasswordReset($user));
        });
        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages(['email' => 'Ссылка недействительна или устарела. Запроси новую.']);
        }
    }

    /** @return bool */
    public function deliveryAvailable(): bool
    {
        return $this->transport->available();
    }
}
