<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Account\AccountDashboardData;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

final class DashboardController extends Controller
{
    /**
     * Принимает сервис безопасного dashboard contract.
     *
     * @param AccountDashboardData $dashboard
     */
    public function __construct(private readonly AccountDashboardData $dashboard) {}

    /**
     * Показывает данные только текущего подтверждённого web-пользователя.
     *
     * @param Request $request
     *
     * @return Response
     *
     * @throws AuthorizationException
     */
    public function __invoke(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user('web');
        Gate::forUser($user)->authorize('view-account-dashboard');
        Inertia::encryptHistory();

        $response = Inertia::render('Account/Dashboard', $this->dashboard->forUser($user))->toResponse($request);
        $response->headers->set('Cache-Control', 'no-store, private');

        return $response;
    }
}
