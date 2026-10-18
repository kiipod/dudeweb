<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

final class PasswordResetLinkRequest extends EmailRequest
{
    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return ['email' => ['required', 'string', 'email', 'max:255']];
    }
}
