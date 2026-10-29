<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use App\Payment\Enums\PaymentSource;
use Illuminate\Container\Attributes\Config;
use Illuminate\Support\Str;

final readonly class PaymentReturnUrl
{
    /**
     * Принимает зависимости для работы PaymentReturnUrl.
     *
     * @param string $configuredBaseUrl
     * @param string $appKey
     * @param int $webTokenTtl
     */
    public function __construct(
        #[Config('yookassa.return_url')]
        private string $configuredBaseUrl,
        #[Config('app.key')]
        private string $appKey,
        #[Config('yookassa.web_return_token_ttl')]
        private int $webTokenTtl,
    ) {}

    /**
     * Создаёт подписанную ссылку возврата к конкретному платежу.
     *
     * @param Payment $payment
     * @param string|null $baseUrl
     *
     * @return string
     */
    public function generate(Payment $payment, ?string $baseUrl = null): string
    {
        $baseUrl ??= $this->configuredBaseUrl;
        $separator = Str::contains($baseUrl, '?') ? '&' : '?';

        return $baseUrl . $separator . http_build_query([
            'payment_id' => $payment->id,
            'token' => $this->signature($payment->id),
        ]);
    }

    /**
     * Проверяет подпись ссылки возврата к платежу.
     *
     * @param Payment $payment
     * @param string $token
     *
     * @return bool
     */
    public function isValid(Payment $payment, string $token): bool
    {
        return hash_equals($this->signature($payment->id), $token)
            && ($payment->source !== PaymentSource::Web
                || ($payment->created_at !== null && $payment->created_at->isAfter(now()->subSeconds($this->webTokenTtl))));
    }

    /**
     * Вычисляет подпись идентификатора платежа ключом приложения.
     *
     * @param int $paymentId
     *
     * @return string
     */
    private function signature(int $paymentId): string
    {
        return hash_hmac('sha256', (string) $paymentId, $this->appKey);
    }
}
