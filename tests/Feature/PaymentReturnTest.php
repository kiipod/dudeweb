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
     * Verify that web payment receives fallback response without authentication.
     *
     * @return void
     */
    public function test_web_payment_receives_fallback_response_without_authentication(): void
    {
        $payment = Payment::factory()->create(['source' => PaymentSource::Web]);
        $url = app(PaymentReturnUrl::class)->generate(
            $payment,
            'http://localhost/payments/return',
        );

        $this->get($url)
            ->assertOk()
            ->assertSee('Платёж обрабатывается');
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
}
