<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Models\Payment;
use App\Payment\Enums\PaymentStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

final class PaymentStatusController
{
    /**
     * Читает только local webhook truth, без polling внешнего API или мутаций.
     *
     * @param Request $request
     * @param Payment $payment
     *
     * @return Response
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function __invoke(Request $request, Payment $payment): Response
    {
        Gate::authorize('view', $payment);
        Inertia::encryptHistory();
        $status = $payment->status === PaymentStatus::Succeeded && $payment->processed_at === null
            ? PaymentStatus::Pending : ($payment->status ?? PaymentStatus::Pending);
        $response = Inertia::render('Account/Payments/Show', [
            'payment' => [
                'id' => $payment->id,
                'status' => $status->value,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'months' => $payment->months,
                'retryUrl' => Gate::allows('retry', $payment)
                    ? route('account.payments.retry', $payment, false) : null,
            ],
        ])->toResponse($request);
        $response->headers->set('Cache-Control', 'no-store, private');

        return $response;
    }
}
