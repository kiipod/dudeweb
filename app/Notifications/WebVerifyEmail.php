<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

final class WebVerifyEmail extends VerifyEmail
{
    /**
     * @param string $url
     * @return MailMessage
     */
    protected function buildMailMessage($url): MailMessage
    {
        return new MailMessage()
            ->subject('Подтверди email для dudeweb')
            ->greeting('Привет!')
            ->line('Подтверди свой email, чтобы получить бесплатный доступ к dudeweb.')
            ->action('Подтвердить email', $url)
            ->line('Ссылка действует ' . config('auth.verification.expire', 60) . ' минут.')
            ->line('Если ты не создавал аккаунт, просто проигнорируй это письмо.');
    }
}
