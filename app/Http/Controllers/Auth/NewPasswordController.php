<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Services\Auth\PasswordRecoveryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class NewPasswordController extends Controller
{
    /**
     * @param Request $request
     * @param string $token
     * @return Response
     */
    public function create(Request $request, string $token): Response
    {
        return Inertia::render('Auth/ResetPassword', ['token' => $token, 'email' => is_string($request->query('email')) ? $request->query('email') : '']);
    }

    /**
     * @param ResetPasswordRequest $request
     * @param PasswordRecoveryService $recovery
     * @return RedirectResponse
     */
    public function store(ResetPasswordRequest $request, PasswordRecoveryService $recovery): RedirectResponse
    {
        $recovery->reset($request->safe()->only(['email', 'password', 'token']));
        return redirect()->route('login')->with('status', 'password-changed');
    }
}
