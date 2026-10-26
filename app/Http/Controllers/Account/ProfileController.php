<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Http\Requests\EndOtherSessionsRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Services\Auth\EmailVerificationService;
use App\Services\Profile\ProfileData;
use App\Services\Profile\ProfileService;
use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

final readonly class ProfileController
{
    /**
     * Принимает profile operations и явно выбранный web guard.
     *
     * @param ProfileData $data
     * @param ProfileService $profiles
     * @param EmailVerificationService $verification
     * @param StatefulGuard $guard
     */
    public function __construct(
        private ProfileData $data,
        private ProfileService $profiles,
        private EmailVerificationService $verification,
        #[Auth('web')]
        private StatefulGuard $guard,
    ) {}

    /**
     * Показывает только собственные подтверждённые данные, запрещает shared cache.
     *
     * @param Request $request
     *
     * @return Response
     *
     * @throws AuthorizationException
     */
    public function show(Request $request): Response
    {
        Gate::authorize('view-account-profile');
        Inertia::encryptHistory();
        $response = Inertia::render('Account/Profile', $this->data->forUser($request->user('web'), $request->session()->getId()))
            ->toResponse($request);
        $response->headers->set('Cache-Control', 'no-store, private');
        return $response;
    }

    /**
     * Меняет identity, после email change направляет к подтверждению нового адреса.
     *
     * @param UpdateProfileRequest $request
     *
     * @return RedirectResponse
     *
     * @throws AuthorizationException
     * @throws ValidationException
     */
    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        return $this->mutation(function () use ($request): RedirectResponse {
            $user = $this->profiles->update($request->user('web'), $request->validated());
            if (!$user->hasVerifiedEmail()) {
                $this->keepCurrentSession($request, $user);
                Inertia::clearHistory();
                $response = redirect()->route('verification.notice');
                return $this->verification->resend($user)
                    ? $response->with('status', 'verification-link-sent')
                    : $response->withErrors(['form' => 'Email изменён. Не удалось отправить письмо — запроси его ещё раз.']);
            }
            return redirect()->route('account.profile');
        });
    }

    /**
     * Меняет пароль и сохраняет текущий сеанс после отзыва остальных.
     *
     * @param UpdatePasswordRequest $request
     *
     * @return RedirectResponse
     *
     * @throws AuthorizationException
     * @throws ValidationException
     */
    public function password(UpdatePasswordRequest $request): RedirectResponse
    {
        return $this->mutation(function () use ($request): RedirectResponse {
            $user = $this->profiles->password($request->user('web'), $request->validated('current_password'), $request->validated('password'));
            $this->keepCurrentSession($request, $user);
            return redirect()->route('account.profile');
        });
    }

    /**
     * Отзывает остальные web-сеансы без запроса и изменения пароля.
     *
     * @param EndOtherSessionsRequest $request
     *
     * @return RedirectResponse
     *
     * @throws AuthorizationException
     * @throws ValidationException
     */
    public function sessions(EndOtherSessionsRequest $request): RedirectResponse
    {
        return $this->mutation(function () use ($request): RedirectResponse {
            $user = $this->profiles->endOtherSessions($request->user('web'));
            $this->keepCurrentSession($request, $user);
            return redirect()->route('account.profile');
        });
    }

    /**
     * Обновляет session ID/CSRF и текущую identity для штатного auth.session middleware.
     *
     * @param Request $request
     * @param \App\Models\User $user
     *
     * @return void
     */
    private function keepCurrentSession(Request $request, \App\Models\User $user): void
    {
        $this->guard->login($user, $this->guard->viaRemember());
        $request->session()->regenerate();
    }

    /**
     * Возвращает safe failure без паролей/email в flash input или logs.
     *
     * @param Closure(): RedirectResponse $operation
     *
     * @return RedirectResponse
     *
     * @throws AuthorizationException
     * @throws ValidationException
     */
    private function mutation(Closure $operation): RedirectResponse
    {
        try {
            return $operation();
        } catch (AuthorizationException|ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            Log::warning('Profile operation failed.', ['exception' => $exception::class]);
            return redirect()->route('account.profile')->withErrors(['form' => 'Не удалось сохранить изменения. Попробуй ещё раз.']);
        }
    }
}
