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
use Illuminate\Container\Attributes\Config;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

final class PaymentController extends Controller
{
    /**
     * @param PaymentService $paymentService
     * @param PromocodeService $promocodeService
     * @param string $paymentReturnUrl
     */
    public function __construct(
        private readonly PaymentService $paymentService,
        private readonly PromocodeService $promocodeService,
        #[Config('yookassa.return_url')]
        private readonly string $paymentReturnUrl,
    ) {}

    /**
     * @param CreatePaymentRequest $request
     * @return JsonResponse
     * @throws \Throwable
     */
    public function store(CreatePaymentRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user('web');
        $validated = $request->validated();
        $product = Product::query()->findOrFail($validated['product_id']);
        $promocode = null;

        if (isset($validated['promocode'])) {
            try {
                $promocode = $this->promocodeService->apply($validated['promocode'], $user);
            } catch (DomainException $exception) {
                throw ValidationException::withMessages([
                    'promocode' => $exception->getMessage(),
                ]);
            }
        }

        try {
            $payment = $this->paymentService->createPayment(
                $user,
                $product,
                $promocode,
                PaymentSource::Web,
                $this->paymentReturnUrl,
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
