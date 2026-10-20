<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\SupportTicket\Pages;

use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;

final class SupportTicketIndexPage extends IndexPage
{
    /**
     * Показывает список и ссылку на native resource detail.
     *
     * @return iterable
     */
    protected function fields(): iterable
    {
        return [ID::make(), Text::make('Тема', 'subject'), Text::make('Клиент', 'user.email'),
            Text::make('Статус', 'status', formatted: fn($item): string => $item->status->label()),
            Date::make('Последняя активность', 'last_activity_at')->format('d.m.Y H:i')];
    }
}
