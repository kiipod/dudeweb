<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Payment;
use Illuminate\Foundation\Http\FormRequest;

final class PreviewPromocodeRequest extends FormRequest
{
    /**
     * Авторизует действие той же policy, что и создание платежа.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return $this->user('web')?->can('create', Payment::class) ?? false;
    }

    /**
     * Проверяет код; product prices никогда не принимаются от клиента.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['promocode' => ['nullable', 'string', 'max:255']];
    }
}
