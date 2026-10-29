<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Models\Payment;
use App\Services\Account\AccountSubscriptionData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

final readonly class SubscriptionController
{
    /**
     * Принимает сервис страницы подписки.
     *
     * @param AccountSubscriptionData $data
     */
    public function __construct(private AccountSubscriptionData $data) {}

    /**
     * Показывает защищённую страницу с серверным catalogue contract.
     *
     * @param Request $request
     *
     * @return Response
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function __invoke(Request $request): Response
    {
        Gate::authorize('create', Payment::class);
        Inertia::encryptHistory();
        $response = Inertia::render('Account/Subscription', $this->data->forUser($request->user('web')))->toResponse($request);
        $response->headers->set('Cache-Control', 'no-store, private');

        return $response;
    }
}
