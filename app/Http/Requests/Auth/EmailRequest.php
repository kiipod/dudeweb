<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

abstract class EmailRequest extends FormRequest
{
    /**
     * Проверяет право пользователя выполнить текущий запрос.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return $this->user('web') === null;
    }

    /**
     * Нормализует email перед проверкой входных данных.
     *
     * @return void
     */
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('email'))) {
            $this->merge(['email' => Str::lower(trim($this->input('email')))]);
        }
    }

    /**
     * Возвращает общие требования к паролю web-аккаунта.
     *
     * @return array<int, mixed>
     */
    protected function passwordRules(): array
    {
        return [
            'required',
            'string',
            'confirmed',
            Password::min(8),
            'max:255',
            static function (string $attribute, mixed $value, Closure $fail): void {
                if (config('hashing.driver') === 'bcrypt' && is_string($value) && strlen($value) > 72) {
                    $fail('Пароль слишком длинный. Используй не больше 72 байт.');
                }
            },
        ];
    }

    /**
     * Возвращает пользовательские сообщения об ошибках проверки.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Укажи email.',
            'email.email' => 'Проверь адрес email.',
            'email.max' => 'Email слишком длинный.',
            'email.unique' => 'Этот email уже используется.',
            'password.required' => 'Введи пароль.',
            'password.confirmed' => 'Пароли не совпадают.',
            'password.min' => 'Используй не менее 8 символов.',
            'password.max' => 'Пароль слишком длинный.',
            'token.required' => 'Ссылка недействительна. Запроси новую.',
        ];
    }
}
