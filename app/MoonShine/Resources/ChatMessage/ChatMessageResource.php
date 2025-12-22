<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ChatMessage;

use App\Models\ChatMessage;
use App\MoonShine\Resources\ChatMessage\Pages\ChatMessageIndexPage;
use App\MoonShine\Resources\ChatMessage\Pages\ChatMessageFormPage;
use App\MoonShine\Resources\ChatMessage\Pages\ChatMessageDetailPage;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<ChatMessage, ChatMessageIndexPage, ChatMessageFormPage, ChatMessageDetailPage>
 */
class ChatMessageResource extends ModelResource
{
    protected string $model = ChatMessage::class;

    protected string $title = 'Сообщения чата';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ChatMessageIndexPage::class,
            ChatMessageFormPage::class,
            ChatMessageDetailPage::class,
        ];
    }

    /**
     * @return string[]
     */
    protected function search(): array
    {
        return [
            'text',
            'placeholders',
        ];
    }
}
