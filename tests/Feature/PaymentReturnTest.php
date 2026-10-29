<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Payment;
use App\Payment\Enums\PaymentSource;
use App\Payment\PaymentReturnUrl;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class PaymentReturnTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Verify that telegram payment returns user to configured bot.
     *
     * @return void
     */
    public function test_telegram_payment_returns_user_to_configured_bot(): void
    {
        config(['services.telegram.bot_username' => '@dudeweb_test_bot']);
        $payment = Payment::factory()->create(['source' => PaymentSource::Telegram]);
        $url = app(PaymentReturnUrl::class)->generate(
            $payment,
            'http://localhost/payments/return',
        );

        $this->get($url)
            ->assertRedirect("https://t.me/dudeweb_test_bot?start=payment_{$payment->id}");
    }

    /**
     * Проверяет redirect к owned status route с последующей проверкой сессии.
     *
     * @return void
     */
    public function test_web_payment_returns_to_protected_status_page(): void
    {
        $payment = Payment::factory()->create(['source' => PaymentSource::Web]);
        $url = app(PaymentReturnUrl::class)->generate(
            $payment,
            'http://localhost/payments/return',
        );

        $this->get($url)
            ->assertRedirect(route('account.payments.show', $payment));
        $this->get(route('account.payments.show', $payment))->assertRedirect('/login');
    }

    /**
     * Verify that tampered return link is rejected.
     *
     * @return void
     */
    public function test_tampered_return_link_is_rejected(): void
    {
        $payment = Payment::factory()->create(['source' => PaymentSource::Telegram]);

        $this->get("/payments/return?payment_id={$payment->id}&token=" . str_repeat('0', 64))
            ->assertForbidden();
    }

    /**
     * Web token живёт сутки; изменение web TTL не меняет Telegram return flow.
     *
     * @return void
     */
    public function test_expired_web_return_is_rejected_without_expiring_telegram_links(): void
    {
        $this->freezeTime();
        config(['services.telegram.bot_username' => 'dudeweb_test_bot']);
        foreach ([PaymentSource::Web, PaymentSource::Telegram] as $source) {
            $payment = Payment::factory()->create(['source' => $source, 'created_at' => now()->subDay()]);
            $url = app(PaymentReturnUrl::class)->generate($payment, 'http://localhost/payments/return');
            if ($source === PaymentSource::Web) {
                $this->get($url)->assertForbidden();
            } else {
                config(['services.telegram.bot_username' => 'dudeweb_test_bot']);
                $this->get($url)->assertRedirect("https://t.me/dudeweb_test_bot?start=payment_{$payment->id}");
            }
        }
    }
}
