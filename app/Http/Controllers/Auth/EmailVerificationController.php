<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendEmailVerificationRequest;
use App\Http\Requests\Auth\VerifyEmailRequest;
use App\Services\Auth\EmailVerificationService;
use App\Services\Auth\WebAccountProvisioner;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class EmailVerificationController extends Controller
{
    /**
     * @param Request $request
     * @return Response|RedirectResponse
     * @throws AuthorizationException
     */
    public function show(Request $request): Response|RedirectResponse
    {
        Gate::authorize('request-email-verification');
        $user = $request->user('web');

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('account.dashboard');
        }

        return Inertia::render('Auth/VerifyEmail', [
            'email' => $user->email,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * @param VerifyEmailRequest $request
     * @param WebAccountProvisioner $provisioner
     * @return RedirectResponse
     */
    public function verify(VerifyEmailRequest $request, WebAccountProvisioner $provisioner): RedirectResponse
    {
        $request->fulfill();
        $provisioner->provision($request->user('web'));

        return redirect()->intended(route('account.dashboard'));
    }

    /**
     * @param SendEmailVerificationRequest $request
     * @param EmailVerificationService $verification
     * @return RedirectResponse
     */
    public function resend(SendEmailVerificationRequest $request, EmailVerificationService $verification): RedirectResponse
    {
        $user = $request->user('web');

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('account.dashboard');
        }

        $response = redirect()->route('verification.notice');

        return $verification->resend($user)
            ? $response->with('status', 'verification-link-sent')
            : $response->withErrors(['form' => 'Не удалось отправить письмо. Попробуй позже или напиши в поддержку.']);
    }
}
