<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ReferralInviteRequest;
use App\Services\ReferralInviteService;
use Illuminate\Http\RedirectResponse;

final class ReferralInviteController
{
    /**
     * Сохраняет первое валидное приглашение только для новой guest registration.
     *
     * @param ReferralInviteRequest $request
     * @param ReferralInviteService $invites
     *
     * @return RedirectResponse
     */
    public function __invoke(ReferralInviteRequest $request, ReferralInviteService $invites): RedirectResponse
    {
        if ($request->user('web') !== null) {
            return redirect()->route('account.dashboard');
        }
        $previous = $request->session()->get('referral.invite');
        if ($invites->resolve(is_string($previous) ? $previous : null) === null
            && $invites->resolve($request->validated('token')) !== null) {
            $request->session()->put('referral.invite', $request->validated('token'));
        }
        return redirect()->route('register');
    }
}
