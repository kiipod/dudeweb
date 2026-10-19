<?php

declare(strict_types=1);

namespace App\Services\Auth;

final class AuthMailTransport
{
    /** @return bool */
    public function available(): bool
    {
        $mailer = config('mail.default');
        $transport = config('mail.mailers.' . $mailer . '.transport');

        return filter_var(config('mail.from.address'), FILTER_VALIDATE_EMAIL) !== false
            && (!in_array($transport, [null, 'log', 'array', 'failover', 'roundrobin'], true)
                || (app()->runningUnitTests() && $transport === 'array'));
    }
}
