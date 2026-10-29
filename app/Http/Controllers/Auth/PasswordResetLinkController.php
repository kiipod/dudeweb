<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\PasswordResetLinkRequest;
use App\Services\Auth\PasswordRecoveryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

final class PasswordResetLinkController extends Controller
{
    /**
     * Показывает форму запроса восстановления пароля.
     *
     * @param Request $request
     *
     * @return Response
     */
    public function create(Request $request): Response
    {
        return Inertia::render(
            'Auth/ForgotPassword',
            ['linkRequested' => $request->session()->get('status') === 'reset-link-requested'],
        );
    }

    /**
     * Принимает запрос восстановления без раскрытия существования email.
     *
     * @param PasswordResetLinkRequest $request
     * @param PasswordRecoveryService $recovery
     *
     * @return RedirectResponse
     *
     * @throws ValidationException
     */
    public function store(PasswordResetLinkRequest $request, PasswordRecoveryService $recovery): RedirectResponse
    {
        $recovery->sendLink($request->validated('email'));
        return redirect()->route('password.request')->with('status', 'reset-link-requested');
    }
}
