<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Http\Requests\RetryPaymentRequest;
use App\Models\Payment;
use App\Payment\WebPaymentPurchase;
use App\Payment\Exceptions\PaymentCreationException;
use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Http\JsonResponse;

final readonly class PaymentRetryController
{
    /**
     * Принимает сервис web-покупки, общий с POST /payments.
     *
     * @param WebPaymentPurchase $purchase
     */
    public function __construct(private WebPaymentPurchase $purchase) {}

    /**
     * Возвращает новый confirmation URL только после успешного service call.
     *
     * @param RetryPaymentRequest $request
     * @param Payment $payment
     *
     * @return JsonResponse
     *
     * @throws \Throwable
     */
    public function __invoke(RetryPaymentRequest $request, Payment $payment): JsonResponse
    {
        try {
            $created = $this->purchase->retry($request->user('web'), $payment, $request->validated('idempotency_key'));
        } catch (PaymentCreationException|LockTimeoutException) {
            return response()->json(['message' => 'Не удалось создать платёж. Попробуйте позже.'], 502);
        }

        return response()->json(['payment_id' => $created->id, 'confirmation_url' => $created->confirmation_url], 201);
    }
}
