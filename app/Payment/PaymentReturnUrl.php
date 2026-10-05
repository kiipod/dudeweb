<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use Illuminate\Support\Str;

final class PaymentReturnUrl
{
    /**
     * @param Payment $payment
     * @param string|null $baseUrl
     * @return string
     */
    public function generate(Payment $payment, ?string $baseUrl = null): string
    {
        $baseUrl ??= (string) config('yookassa.return_url');
        $separator = Str::contains($baseUrl, '?') ? '&' : '?';

        return $baseUrl . $separator . http_build_query([
            'payment_id' => $payment->id,
            'token' => $this->signature($payment->id),
        ]);
    }

    /**
     * @param Payment $payment
     * @param string $token
     * @return bool
     */
    public function isValid(Payment $payment, string $token): bool
    {
        return hash_equals($this->signature($payment->id), $token);
    }

    /**
     * @param int $paymentId
     * @return string
     */
    private function signature(int $paymentId): string
    {
        return hash_hmac('sha256', (string) $paymentId, (string) config('app.key'));
    }
}
