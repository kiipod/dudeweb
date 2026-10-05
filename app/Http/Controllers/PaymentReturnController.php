<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Payment\Enums\PaymentSource;
use App\Payment\PaymentReturnUrl;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class PaymentReturnController extends Controller
{
    /**
     * @param Request $request
     * @param PaymentReturnUrl $returnUrl
     * @return RedirectResponse|Response
     */
    public function __invoke(Request $request, PaymentReturnUrl $returnUrl): RedirectResponse|Response
    {
        $validated = $request->validate([
            'payment_id' => ['required', 'integer'],
            'token' => ['required', 'string', 'size:64'],
        ]);
        $payment = Payment::query()->findOrFail($validated['payment_id']);

        abort_unless($returnUrl->isValid($payment, $validated['token']), 403);

        if ($payment->source === PaymentSource::Telegram) {
            $username = ltrim((string) config('services.telegram.bot_username'), '@');

            abort_if($username === '', 503, 'Telegram bot username is not configured.');

            return redirect()->away("https://t.me/{$username}?start=payment_{$payment->id}");
        }

        return response(
            'Платёж обрабатывается. Итоговый статус будет обновлён после подтверждения YooKassa.',
        );
    }
}
