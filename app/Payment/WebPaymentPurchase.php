<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use App\Payment\Enums\PaymentSource;
use App\Services\PromocodeService;
use DomainException;
use Illuminate\Container\Attributes\Config;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

final readonly class WebPaymentPurchase
{
    /**
     * Принимает существующий payment facade, правила промокодов и return URL.
     *
     * @param PaymentService $payments
     * @param PromocodeService $promocodes
     * @param string $returnUrl
     */
    public function __construct(
        private PaymentService $payments,
        private PromocodeService $promocodes,
        #[Config('yookassa.return_url')]
        private string $returnUrl,
    ) {}

    /**
     * Сериализует одинаковый web intent до проверки и создания local/provider payment.
     *
     * @param User $user
     * @param Product $product
     * @param string|null $code
     * @param string|null $key
     *
     * @return Payment
     *
     * @throws \Throwable
     */
    public function create(User $user, Product $product, ?string $code, ?string $key): Payment
    {
        $key ??= (string) Str::uuid();

        return Cache::lock('web-payment:' . hash('sha256', $key), 120)->block(5, function () use ($user, $product, $code, $key): Payment {
            $existing = Payment::query()->with('promocode')->where('idempotency_key', $key)->first();
            if ($existing !== null) {
                $samePromo = $code === null
                    ? $existing->promocode === null || $existing->promocode->user_id === $user->id
                    : mb_strtolower(trim($code)) === mb_strtolower((string) $existing->promocode?->title);
                if ($existing->user_id !== $user->id || $existing->product_id !== $product->id || $existing->source !== PaymentSource::Web || !$samePromo) {
                    throw ValidationException::withMessages(['form' => 'Попытка оплаты уже использована. Обнови страницу перед новой оплатой.']);
                }
                if ($existing->yookassa_payment_id !== null) {
                    return $existing;
                }
            }
            $product->loadMissing('plan');
            if ($product->status !== 'active' || $product->plan->status !== 'active' || !in_array($product->months, [1, 3, 6, 12], true) || $product->price <= 0) {
                throw ValidationException::withMessages(['product_id' => 'Этот период сейчас недоступен. Выбери другой.']);
            }
            try {
                $promo = $code === null ? null : $this->promocodes->apply($code, $user);
                $promo = $this->promocodes->resolveForPayment($user, $promo);
                if ($promo !== null) {
                    $this->promocodes->validateForUser($promo, $user);
                }
            } catch (DomainException $exception) {
                throw ValidationException::withMessages(['promocode' => $exception->getMessage()]);
            }

            return $this->payments->createPayment($user, $product, $promo, PaymentSource::Web, $this->returnUrl, $key);
        });
    }

    /**
     * Создаёт новую попытку с повторной проверкой продукта и исходного промокода.
     *
     * @param User $user
     * @param Payment $payment
     * @param string|null $key
     *
     * @return Payment
     *
     * @throws \Throwable
     */
    public function retry(User $user, Payment $payment, ?string $key): Payment
    {
        $payment->loadMissing('product', 'promocode');
        if ($payment->product === null) {
            throw ValidationException::withMessages(['product_id' => 'Этот период больше недоступен. Выбери подписку заново.']);
        }
        if ($key === $payment->idempotency_key) {
            throw ValidationException::withMessages(['form' => 'Для повторной оплаты нужна новая попытка.']);
        }
        if ($payment->promocode === null && $payment->amount < $payment->original_amount) {
            throw ValidationException::withMessages(['promocode' => 'Исходный промокод больше недоступен. Выбери подписку заново.']);
        }

        return $this->create($user, $payment->product, $payment->promocode?->user_id === null ? $payment->promocode?->title : null, $key);
    }
}
