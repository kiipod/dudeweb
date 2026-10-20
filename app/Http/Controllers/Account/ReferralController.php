<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Services\Account\AccountReferralData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

final readonly class ReferralController
{
    /**
     * Принимает сервис агрегатов и live terms.
     *
     * @param AccountReferralData $data
     */
    public function __construct(private AccountReferralData $data) {}

    /**
     * Показывает только статистику текущей web-сессии.
     *
     * @param Request $request
     *
     * @return Response
     *
     * @throws \Throwable
     */
    public function index(Request $request): Response
    {
        Gate::authorize('view-account-referral');
        Inertia::encryptHistory();
        $response = Inertia::render('Account/Referral/Index', $this->data->overview($request->user('web')))->toResponse($request);
        $response->headers->set('Cache-Control', 'no-store, private');
        return $response;
    }

    /**
     * Показывает live условия без mutations.
     *
     * @param Request $request
     *
     * @return Response
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \JsonException
     */
    public function terms(Request $request): Response
    {
        Gate::authorize('view-account-referral');
        $response = Inertia::render('Account/Referral/Terms', $this->data->terms())->toResponse($request);
        $response->headers->set('Cache-Control', 'no-store, private');
        return $response;
    }
}
