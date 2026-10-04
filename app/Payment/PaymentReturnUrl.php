<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use Illuminate\Support\Str;

final class PaymentReturnUrl
{
    public function generate(Payment $payment, ?string $baseUrl = null): string
    {
        $baseUrl ??= (string) config('yookassa.return_url');
        $separator = Str::contains($baseUrl, '?') ? '&' : '?';

        return $baseUrl . $separator . http_build_query([
            'payment_id' => $payment->id,
            'token' => $this->signature($payment->id),
        ]);
    }

    public function isValid(Payment $payment, string $token): bool
    {
        return hash_equals($this->signature($payment->id), $token);
    }

    private function signature(int $paymentId): string
    {
        return hash_hmac('sha256', (string) $paymentId, (string) config('app.key'));
    }
}
