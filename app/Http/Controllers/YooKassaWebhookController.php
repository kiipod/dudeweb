<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Payment\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

final class YooKassaWebhookController extends Controller
{
    /**
     * @param Request $request
     * @param PaymentService $paymentService
     * @return JsonResponse
     */
    public function __invoke(Request $request, PaymentService $paymentService): JsonResponse
    {
        try {
            $paymentService->handleNotification($request->getContent());
        } catch (Throwable $exception) {
            Log::error('YooKassa webhook processing failed.', [
                'exception' => $exception::class,
                'code' => $exception->getCode(),
            ]);

            return response()->json(['message' => 'Webhook processing failed.'], 500);
        }

        return response()->json(['status' => 'ok']);
    }
}
