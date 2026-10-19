<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Auth\EmailVerificationRequest;

final class VerifyEmailRequest extends EmailVerificationRequest
{
    /** @return bool */
    public function authorize(): bool
    {
        return ($this->user('web')?->can('request-email-verification') ?? false)
            && parent::authorize();
    }
}
