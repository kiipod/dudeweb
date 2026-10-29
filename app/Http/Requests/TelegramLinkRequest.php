<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\Attributes\RedirectToRoute;
use Illuminate\Foundation\Http\FormRequest;

#[RedirectToRoute('account.profile')]
final class TelegramLinkRequest extends FormRequest
{
    /**
     * Start требует capability, recovery/cancel — текущего подтверждённого owner.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        $ability = $this->routeIs('account.profile.telegram.start') ? 'link-account-telegram' : 'view-account-profile';
        return $this->user('web')?->can($ability) ?? false;
    }

    /**
     * Не принимает Telegram identity из браузера, только own challenge selector.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return $this->routeIs('account.profile.telegram.start') ? [] : ['link_id' => ['required', 'integer', 'min:1']];
    }
}
