<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\SupportTicketStatus;
use App\Models\SupportTicket;
use App\Models\User;
use MoonShine\Laravel\Models\MoonshineUser;

final class SupportTicketPolicy
{
    /**
     * Разрешает список подтверждённому клиенту или существующему оператору.
     *
     * @param User|MoonshineUser $actor
     *
     * @return bool
     */
    public function viewAny(User|MoonshineUser $actor): bool
    {
        return $actor instanceof MoonshineUser ? $actor->exists : $actor->email !== null && $actor->hasVerifiedEmail();
    }

    /**
     * Разрешает создание только клиенту подтверждённой web-сессии.
     *
     * @param User|MoonshineUser $actor
     *
     * @return bool
     */
    public function create(User|MoonshineUser $actor): bool
    {
        return $actor instanceof User && $this->viewAny($actor);
    }

    /**
     * Разрешает оператору чтение, клиенту — только собственное обращение.
     *
     * @param User|MoonshineUser $actor
     * @param SupportTicket $ticket
     *
     * @return bool
     */
    public function view(User|MoonshineUser $actor, SupportTicket $ticket): bool
    {
        return $this->viewAny($actor) && ($actor instanceof MoonshineUser || $ticket->user_id === $actor->id);
    }

    /**
     * Разрешает ответы только в открытое доступное обращение.
     *
     * @param User|MoonshineUser $actor
     * @param SupportTicket $ticket
     *
     * @return bool
     */
    public function reply(User|MoonshineUser $actor, SupportTicket $ticket): bool
    {
        return $this->view($actor, $ticket) && $ticket->status === SupportTicketStatus::Open;
    }

    /**
     * Разрешает переходы статуса только операторам MoonShine.
     *
     * @param User|MoonshineUser $actor
     * @param SupportTicket $ticket
     *
     * @return bool
     */
    public function transition(User|MoonshineUser $actor, SupportTicket $ticket): bool
    {
        return $actor instanceof MoonshineUser && $this->view($actor, $ticket);
    }
}
