<?php

declare(strict_types=1);

namespace App\Enums;

enum SupportTicketStatus: string
{
    case Open = 'OPEN';
    case Closed = 'CLOSED';

    /**
     * Возвращает понятный клиенту статус обращения.
     *
     * @return string
     */
    public function label(): string
    {
        return $this === self::Open ? 'Открыто' : 'Закрыто';
    }
}
