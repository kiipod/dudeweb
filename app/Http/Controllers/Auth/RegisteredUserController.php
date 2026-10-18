<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\Auth\WebAccountProvisioner;
use App\Services\Auth\WebRegistrationService;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class RegisteredUserController extends Controller
{
    /** @param StatefulGuard $guard */
    public function __construct(#[Auth('web')] private readonly StatefulGuard $guard) {}

    /** @return Response */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * @param RegisterRequest $request
     * @param WebRegistrationService $registration
     * @param WebAccountProvisioner $provisioner
     * @return RedirectResponse
     */
    public function store(RegisterRequest $request, WebRegistrationService $registration, WebAccountProvisioner $provisioner): RedirectResponse
    {
        $data = $request->validated();
        $user = $registration->create($data['email'], $data['password']);
        $this->guard->login($user);
        $request->session()->regenerate();
        $provisioner->provision($user);
        return redirect()->route('account.dashboard');
    }
}
