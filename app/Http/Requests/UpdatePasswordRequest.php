<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Foundation\Http\Attributes\RedirectToRoute;
use Illuminate\Validation\Rules\Password;

#[RedirectToRoute('account.profile')]
final class UpdatePasswordRequest extends FormRequest
{
    /**
     * Проверяет доступность password операции текущему владельцу.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return $this->user('web')?->can('secure-account-profile') ?? false;
    }

    /**
     * Использует действующий web password policy, включая bcrypt byte limit.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'current_password' => ['required', 'string', 'current_password:web'],
            'password' => [
                'required', 'string', 'confirmed', Password::min(8), 'max:255',
                static function (string $attribute, mixed $value, Closure $fail): void {
                    if (config('hashing.driver') === 'bcrypt' && is_string($value) && strlen($value) > 72) {
                        $fail('Пароль слишком длинный. Используй не больше 72 байт.');
                    }
                },
            ],
        ];
    }
}
