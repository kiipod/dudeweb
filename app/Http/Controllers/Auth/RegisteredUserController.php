<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\Auth\EmailVerificationService;
use App\Services\Auth\WebRegistrationService;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class RegisteredUserController extends Controller
{
    /**
     * Принимает зависимости для работы RegisteredUserController.
     *
     * @param StatefulGuard $guard
     */
    public function __construct(#[Auth('web')] private readonly StatefulGuard $guard) {}

    /**
     * Показывает форму регистрации web-аккаунта.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Создаёт локальный аккаунт, открывает сессию и запрашивает подтверждение email.
     *
     * @param RegisterRequest $request
     * @param WebRegistrationService $registration
     * @param EmailVerificationService $verification
     *
     * @return RedirectResponse
     *
     * @throws \Illuminate\Database\UniqueConstraintViolationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(
        RegisterRequest $request,
        WebRegistrationService $registration,
        EmailVerificationService $verification,
    ): RedirectResponse {
        $data = $request->validated();
        $user = $registration->create($data['email'], $data['password']);
        $this->guard->login($user);
        $request->session()->regenerate();
        $response = redirect()->route('verification.notice');

        return $verification->registered($user)
            ? $response->with('status', 'verification-link-sent')
            : $response->withErrors(['form' => 'Аккаунт сохранён. Не удалось отправить письмо. Попробуй отправить его ещё раз.']);
    }
}
