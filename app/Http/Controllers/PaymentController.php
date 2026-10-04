<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\CreatePaymentRequest;
use App\Models\Product;
use App\Models\User;
use App\Payment\Enums\PaymentSource;
use App\Payment\Exceptions\PaymentCreationException;
use App\Payment\PaymentService;
use App\Services\PromocodeService;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

final class PaymentController extends Controller
{
    /**
     * @param CreatePaymentRequest $request
     * @param PaymentService $paymentService
     * @param PromocodeService $promocodeService
     * @return JsonResponse
     * @throws \Throwable
     */
    public function store(
        CreatePaymentRequest $request,
        PaymentService $paymentService,
        PromocodeService $promocodeService,
    ): JsonResponse {
        /** @var User $user */
        $user = $request->user('web');
        $validated = $request->validated();
        $product = Product::query()->findOrFail($validated['product_id']);
        $promocode = null;

        if (isset($validated['promocode'])) {
            try {
                $promocode = $promocodeService->apply($validated['promocode'], $user);
            } catch (DomainException $exception) {
                throw ValidationException::withMessages([
                    'promocode' => $exception->getMessage(),
                ]);
            }
        }

        try {
            $payment = $paymentService->createPayment(
                $user,
                $product,
                $promocode,
                PaymentSource::Web,
                (string) config('yookassa.return_url'),
                $request->header('Idempotency-Key'),
            );
        } catch (PaymentCreationException) {
            return response()->json([
                'message' => 'Не удалось создать платёж. Попробуйте позже.',
            ], 502);
        }

        return response()->json([
            'payment_id' => $payment->id,
            'confirmation_url' => $payment->confirmation_url,
        ], 201);
    }
}
