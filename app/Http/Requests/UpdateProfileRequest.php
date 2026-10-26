<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Foundation\Http\Attributes\RedirectToRoute;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

#[RedirectToRoute('account.profile')]
final class UpdateProfileRequest extends FormRequest
{
    /**
     * Проверяет capability текущего владельца.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return $this->user('web')?->can('update-account-profile') ?? false;
    }

    /**
     * Нормализует адрес до uniqueness/current-password validation.
     *
     * @return void
     */
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('username'))) {
            $this->merge(['username' => Str::lower(trim($this->input('username')))]);
        }
        if (is_string($this->input('email'))) {
            $this->merge(['email' => Str::lower(trim($this->input('email')))]);
        }
    }

    /**
     * Ограничивает writable fields и требует пароль только при смене email.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $user = $this->user('web');
        return [
            'username' => ['nullable', 'string', 'min:3', 'max:32', 'regex:/\A[a-z0-9_]+\z/', Rule::unique('users', 'profile_username')->ignore($user)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'current_password' => $this->input('email') !== $user?->email
                ? ['required', 'string', 'current_password:web']
                : ['exclude'],
        ];
    }
}
