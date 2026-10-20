<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class ReferralInviteRequest extends FormRequest
{
    /**
     * Приглашение доступно публично и не изменяет существующий аккаунт.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Проверяет единственный opaque path parameter.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['token' => ['required', 'string', 'regex:/\A[A-Za-z0-9]{40}\z/']];
    }

    /**
     * Использует route token, игнорируя попытки подменить его query-параметром.
     *
     * @return void
     */
    protected function prepareForValidation(): void
    {
        $this->merge(['token' => $this->route('token')]);
    }
}
