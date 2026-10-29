<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\SupportTicket\Pages;

use App\Enums\SupportTicketStatus;
use App\Services\Support\SupportConversationService;
use App\Services\Support\SupportData;
use Illuminate\Support\Str;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Components\FlexibleRender;
use MoonShine\UI\Fields\Text;

final class SupportTicketDetailPage extends DetailPage
{
    /**
     * Показывает безопасные атрибуты текущего ticket.
     *
     * @return iterable
     */
    protected function fields(): iterable
    {
        return [Text::make('Тема', 'subject'), Text::make('Клиент', 'user.email'),
            Text::make('Статус', 'status', formatted: fn($item): string => $item->status->label())];
    }

    /**
     * Рендерит ordered history и доступные с клавиатуры dedicated POST forms.
     *
     * @return array
     *
     * @throws \Throwable
     */
    protected function bottomLayer(): array
    {
        $ticket = $this->getItem();
        return [...parent::bottomLayer(), FlexibleRender::make(view('moonshine.support-conversation', [
            'ticket' => $ticket,
            'messages' => $ticket->messages()->orderBy('created_at')->orderBy('id')->paginate(SupportData::MESSAGES_PER_PAGE),
            'submissionId' => (string) Str::uuid(), 'bodyMax' => SupportConversationService::BODY_MAX,
            'isOpen' => $ticket->status === SupportTicketStatus::Open,
        ]))];
    }
}
