<?php

declare(strict_types=1);

namespace App\Bot\Telegram;

use DefStudio\Telegraph\Handlers\WebhookHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class BotHandler extends WebhookHandler
{
    /**
     * Метод вызывается при вводе начальной команды /start
     *
     * @return void
     */
    public function start(): void
    {
        $this->chat->markdown("*Привет*, рад тебя видеть!")->send();
    }

    /**
     * Метод вызывается в случае падения вебхука и ошибки 500
     *
     * @param Throwable $throwable
     * @return void
     * @throws Throwable
     */
    protected function onFailure(\Throwable $throwable): void
    {
        if ($throwable instanceof NotFoundHttpException) {
            throw $throwable;
        }

        report($throwable);

        $this->reply('Извините, произошла ошибка. Сервер Telegram временно не отвечает.');
    }
}
