<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RetryProvisioningRequest;
use App\Services\Auth\WebAccountProvisioner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ProvisioningController extends Controller
{
    /**
     * Минимальный authenticated результат регистрации до dashboard шага 8.
     *
     * @param Request $request
     *
     * @return Response
     */
    public function show(Request $request): Response
    {
        $user = $request->user('web');
        return Inertia::render(
            'Auth/AccountReady',
            ['email' => $user->email, 'provisioningState' => $user->provisioning_state?->value],
        );
    }

    /**
     * Повторяет настройку удалённого аккаунта подтверждённого пользователя.
     *
     * @param RetryProvisioningRequest $request
     * @param WebAccountProvisioner $provisioner
     *
     * @return RedirectResponse
     */
    public function store(RetryProvisioningRequest $request, WebAccountProvisioner $provisioner): RedirectResponse
    {
        $provisioner->provision($request->user('web'));
        return redirect()->route('account.dashboard');
    }
}
