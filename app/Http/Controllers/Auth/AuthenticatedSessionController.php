<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

final class AuthenticatedSessionController extends Controller
{
    /**
     * Принимает зависимости для работы AuthenticatedSessionController.
     *
     * @param StatefulGuard $guard
     */
    public function __construct(#[Auth('web')] private readonly StatefulGuard $guard) {}

    /**
     * Показывает форму входа и результат смены пароля.
     *
     * @param Request $request
     *
     * @return Response
     */
    public function create(Request $request): Response
    {
        return Inertia::render(
            'Auth/Login',
            ['passwordChanged' => $request->session()->get('status') === 'password-changed'],
        );
    }

    /**
     * Открывает web-сессию и направляет пользователя к подтверждению email или целевой странице.
     *
     * @param LoginRequest $request
     *
     * @return RedirectResponse
     *
     * @throws ValidationException
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        if (!$this->guard->attempt($request->validated())) {
            throw ValidationException::withMessages(['email' => 'Email или пароль не совпадают.']);
        }
        $request->session()->regenerate();

        $intendedPath = parse_url((string) $request->session()->get('url.intended'), PHP_URL_PATH);
        if (!$this->guard->user()->hasVerifiedEmail() && !str_starts_with((string) $intendedPath, '/email/verify/')) {
            return redirect()->route('verification.notice');
        }

        return redirect()->intended(route('account.dashboard'));
    }

    /**
     * Завершает web-сессию и обновляет CSRF-токен.
     *
     * @param Request $request
     *
     * @return RedirectResponse
     */
    public function destroy(Request $request): RedirectResponse
    {
        $this->guard->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('home');
    }
}
