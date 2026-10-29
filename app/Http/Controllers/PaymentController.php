<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\CreatePaymentRequest;
use App\Models\Product;
use App\Models\User;
use App\Payment\Exceptions\PaymentCreationException;
use App\Payment\WebPaymentPurchase;
use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

final class PaymentController extends Controller
{
    /**
     * Принимает зависимости для работы PaymentController.
     *
     * @param WebPaymentPurchase $purchase
     */
    public function __construct(
        private readonly WebPaymentPurchase $purchase,
    ) {}

    /**
     * Создаёт web-платёж по проверенным данным и возвращает ссылку оплаты.
     *
     * @param CreatePaymentRequest $request
     *
     * @return JsonResponse
     *
     * @throws \Throwable
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     * @throws ValidationException
     */
    public function store(CreatePaymentRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user('web');
        $validated = $request->validated();
        $product = Product::query()->findOrFail($validated['product_id']);
        try {
            $payment = $this->purchase->create(
                $user,
                $product,
                $validated['promocode'] ?? null,
                $request->header('Idempotency-Key'),
            );
        } catch (PaymentCreationException|LockTimeoutException) {
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
