<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Payment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class CreatePaymentRequest extends FormRequest
{
    /**
     * Проверяет право пользователя выполнить текущий запрос.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return $this->user('web')?->can('create', Payment::class) ?? false;
    }

    /**
     * Возвращает правила проверки входных данных запроса.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'product_id' => [
                'required',
                'integer',
                Rule::exists('products', 'id')->where('status', 'active'),
            ],
            'promocode' => ['nullable', 'string', 'max:255'],
            'idempotency_key' => ['nullable', 'string', 'min:1', 'max:64', 'regex:/^[a-zA-Z0-9_-]+$/D'],
        ];
    }

    /**
     * Включает существующий заголовок идемпотентности в FormRequest validation.
     *
     * @return array<string, mixed>
     */
    public function validationData(): array
    {
        return [...parent::validationData(), 'idempotency_key' => $this->header('Idempotency-Key')];
    }
}
