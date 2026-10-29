<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RetryProvisioningRequest;
use App\Services\Auth\WebAccountProvisioner;
use Illuminate\Http\RedirectResponse;

final class ProvisioningController extends Controller
{
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
