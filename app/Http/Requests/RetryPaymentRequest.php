<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class RetryPaymentRequest extends FormRequest
{
    /**
     * Не допускает retry чужого, pending, successful или Telegram payment.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return $this->user('web')?->can('retry', $this->route('payment')) ?? false;
    }

    /**
     * Проверяет заголовок новой логической попытки.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['idempotency_key' => ['required', 'string', 'min:1', 'max:64', 'regex:/^[a-zA-Z0-9_-]+$/D']];
    }

    /**
     * Источником ключа служит только request header.
     *
     * @return array<string, mixed>
     */
    public function validationData(): array
    {
        return ['idempotency_key' => $this->header('Idempotency-Key')];
    }
}
