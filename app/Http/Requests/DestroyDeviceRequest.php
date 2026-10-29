<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class DestroyDeviceRequest extends FormRequest
{
    /**
     * Авторизует удаление через dedicated account capability.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return $this->user('web')?->can('delete-account-device') ?? false;
    }

    /**
     * Принимает только opaque token, а не user ID или raw HWID от клиента.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['device' => ['required', 'string', 'max:4096']];
    }
}
