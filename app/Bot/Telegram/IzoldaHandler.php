<?php

declare(strict_types=1);

namespace App\Bot\Telegram;

use DefStudio\Telegraph\Handlers\WebhookHandler;
use DefStudio\Telegraph\Keyboard\Button;
use DefStudio\Telegraph\Keyboard\Keyboard;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class IzoldaHandler extends WebhookHandler
{
    /**
     * @return void
     */
    public function start(): void
    {
        $text = <<<MD
🧠 *Онлайн-клуб психолога*

Это пространство поддержки, роста и внутреннего спокойствия 💚

В клубе вы получите:
• еженедельные практики и разборы
• закрытые эфиры с психологом
• ответы на личные вопросы
• поддерживающее сообщество

Выберите удобный срок доступа 👇
MD;

        $this->chat
            ->markdown($text)
            ->keyboard(
                Keyboard::make()
                    ->row([
                        Button::make('1 месяц')->action('buy1'),
                        Button::make('3 месяца')->action('buy3'),
                    ])
                    ->row([
                        Button::make('6 месяцев')->action('buy6'),
                        Button::make('12 месяцев')->action('buy12'),
                    ]),
            )
            ->send();
    }

    /**
     * 1 месяц
     */
    public function buy1(): void
    {
        $this->sendTariffMessage(
            months: 1,
            price: 299,
        );
    }

    /**
     * 3 месяца
     */
    public function buy3(): void
    {
        $this->sendTariffMessage(
            months: 3,
            price: 999,
        );
    }

    /**
     * 1 месяц
     */
    public function buy6(): void
    {
        $this->sendTariffMessage(
            months: 6,
            price: 1799,
        );
    }

    /**
     * 3 месяца
     */
    public function buy12(): void
    {
        $this->sendTariffMessage(
            months: 12,
            price: 3499,
        );
    }

    /**
     * Универсальный метод отправки сообщения
     */
    protected function sendTariffMessage(int $months, int $price): void
    {
        $text = <<<MD
✨ *Вы выбрали доступ в онлайн-клуб*

📆 Срок доступа: *{$months} {$this->pluralMonths($months)}*
💰 Стоимость: *{$price} ₽*

После оплаты вы получите:
• доступ в закрытый Telegram-чат
• календарь мероприятий клуба
• запись ближайшего эфира

Нажмите кнопку ниже, чтобы перейти к оплате 👇
MD;

        $this->chat
            ->markdown($text)
            ->keyboard(
                Keyboard::make()
                    ->row([
                        Button::make('💳 Оплатить')->action("pay{$months}"),
                    ])
                    ->row([
                        Button::make('⬅️ Изменить тариф')->action('start'),
                    ]),
            )
            ->send();
    }

    /**
     * Склонение слова "месяц"
     */
    protected function pluralMonths(int $months): string
    {
        return match ($months) {
            1 => 'месяц',
            2, 3, 4 => 'месяца',
            default => 'месяцев',
        };
    }

    /**
     * Метод вызывается в случае падения вебхука и ошибки 500
     *
     * @param Throwable $throwable
     * @return void
     * @throws Throwable
     */
    protected function onFailure(Throwable $throwable): void
    {
        if ($throwable instanceof NotFoundHttpException) {
            throw $throwable;
        }

        report($throwable);

        $this->reply('Извините, произошла ошибка. Сервер временно не отвечает.');
    }
}
