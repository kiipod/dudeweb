<?php

declare(strict_types=1);

namespace App\Payment;

use App\Models\Payment;
use App\Models\TelegramBot;
use DefStudio\Telegraph\Keyboard\Button;
use DefStudio\Telegraph\Keyboard\Keyboard;
use DefStudio\Telegraph\Models\TelegraphChat;

final class TelegramPaymentNotifier
{
    /**
     * Сообщает в Telegram об успешной оплате подписки.
     *
     * @param Payment $payment
     *
     * @return void
     */
    public function succeeded(Payment $payment): void
    {
        $expiresAt = $payment->subscription_expires_at
            ->timezone('Europe/Moscow')
            ->format('d.m.Y');

        $this->chat($payment)
            ->markdown("✅ Оплата прошла успешно.\n\nПодписка продлена до *{$expiresAt}*.")
            ->send();
    }

    /**
     * Сообщает в Telegram об отмене и доступности повторной оплаты.
     *
     * @param Payment $payment
     * @param PaymentCancellation $cancellation
     *
     * @return void
     */
    public function canceled(Payment $payment, PaymentCancellation $cancellation): void
    {
        $message = "❌ {$cancellation->message}";

        if (!$cancellation->retryAllowed) {
            $this->chat($payment)->markdown($message)->send();

            return;
        }

        $button = Button::make('Попробовать снова')
            ->action('buy')
            ->param('product', $payment->product_id);

        if ($payment->promocode_id !== null) {
            $button->param('promocode', $payment->promocode_id);
        }

        $this->chat($payment)
            ->markdown($message)
            ->keyboard(Keyboard::make()->buttons([$button]))
            ->send();
    }

    /**
     * Находит Telegram-чат плательщика для отправки уведомления.
     *
     * @param Payment $payment
     *
     * @return TelegraphChat
     */
    private function chat(Payment $payment): TelegraphChat
    {
        $payment->loadMissing('user');

        $bot = TelegramBot::query()->firstOrFail();

        return $bot->chats()
            ->where('chat_id', $payment->user->chat_id)
            ->firstOrFail();
    }
}
