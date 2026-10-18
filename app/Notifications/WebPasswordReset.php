<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

final class WebPasswordReset extends ResetPassword
{
    /**
     * @param mixed $notifiable
     * @return MailMessage
     */
    public function toMail($notifiable): MailMessage
    {
        return new MailMessage()
            ->subject('Восстановление доступа к dudeweb')
            ->line('Ты получил это письмо, потому что мы получили запрос на смену пароля.')
            ->action('Сменить пароль', $this->resetUrl($notifiable))
            ->line('Ссылка действует ' . config('auth.passwords.users.expire') . ' минут.')
            ->line('Если ты не запрашивал смену пароля, просто проигнорируй это письмо.');
    }
}
