<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Foundation\Http\Attributes\RedirectToRoute;

#[RedirectToRoute('account.profile')]
final class EndOtherSessionsRequest extends FormRequest
{
    /**
     * Авторизует security action текущей web identity.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return $this->user('web')?->can('update-account-profile') ?? false;
    }

    /**
     * Действие использует только текущую web identity и не принимает credentials.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }
}
