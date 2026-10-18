<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

final class RetryProvisioningRequest extends FormRequest
{
    /** @return bool */
    public function authorize(): bool
    {
        return $this->user('web')?->can('provision-web-account') ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [];
    }
}
