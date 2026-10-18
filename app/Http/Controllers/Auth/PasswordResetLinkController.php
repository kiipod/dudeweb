<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\PasswordResetLinkRequest;
use App\Services\Auth\PasswordRecoveryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class PasswordResetLinkController extends Controller
{
    /**
     * @param Request $request
     * @return Response
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/ForgotPassword', ['linkRequested' => $request->session()->get('status') === 'reset-link-requested']);
    }

    /**
     * @param PasswordResetLinkRequest $request
     * @param PasswordRecoveryService $recovery
     * @return RedirectResponse
     */
    public function store(PasswordResetLinkRequest $request, PasswordRecoveryService $recovery): RedirectResponse
    {
        $recovery->sendLink($request->validated('email'));
        return redirect()->route('password.request')->with('status', 'reset-link-requested');
    }
}
