<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\TelegraphChat;

use App\MoonShine\Resources\TelegraphChat\Pages\TelegraphChatIndexPage;
use App\MoonShine\Resources\TelegraphChat\Pages\TelegraphChatFormPage;
use App\MoonShine\Resources\TelegraphChat\Pages\TelegraphChatDetailPage;
use DefStudio\Telegraph\Models\TelegraphChat;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<TelegraphChat, TelegraphChatIndexPage, TelegraphChatFormPage, TelegraphChatDetailPage>
 */
class TelegraphChatResource extends ModelResource
{
    protected string $model = TelegraphChat::class;

    protected string $title = 'Telegraph чаты';

    /**
     * Задаёт страницы списка, просмотра и редактирования ресурса.
     *
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            TelegraphChatIndexPage::class,
            TelegraphChatFormPage::class,
            TelegraphChatDetailPage::class,
        ];
    }

    /**
     * Определяет поля ресурса, доступные для текстового поиска.
     *
     * @return string[]
     */
    protected function search(): array
    {
        return [
            'chat_id',
            'name',
            'telegraph_bot_id',
        ];
    }
}
