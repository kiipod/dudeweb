<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Services\Account\AccountConnectionData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

final readonly class ConnectionController
{
    /**
     * Принимает сервис безопасных connection props.
     *
     * @param AccountConnectionData $data
     */
    public function __construct(private AccountConnectionData $data) {}

    /**
     * Показывает подключение только для текущей подтверждённой web-сессии.
     *
     * @param Request $request
     *
     * @return Response
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function __invoke(Request $request): Response
    {
        Gate::authorize('view-account-connection');
        Inertia::encryptHistory();
        $response = Inertia::render('Account/Connection', $this->data->forUser($request->user('web')))->toResponse($request);
        $response->headers->set('Cache-Control', 'no-store, private');
        return $response;
    }
}
