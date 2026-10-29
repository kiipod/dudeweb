<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

final class ResetPasswordRequest extends EmailRequest
{
    /**
     * Возвращает правила проверки входных данных запроса.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => $this->passwordRules(),
            'token' => ['required', 'string', 'max:255'],
        ];
    }
}
