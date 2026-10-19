<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class PaymentReturnRequest extends FormRequest
{
    /**
     * Проверяет право пользователя выполнить текущий запрос.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Возвращает правила проверки входных данных запроса.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'payment_id' => ['required', 'integer'],
            'token' => ['required', 'string', 'size:64'],
        ];
    }
}
