<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\TelegraphBot;

use DefStudio\Telegraph\Models\TelegraphBot;
use App\MoonShine\Resources\TelegraphBot\Pages\TelegraphBotIndexPage;
use App\MoonShine\Resources\TelegraphBot\Pages\TelegraphBotFormPage;
use App\MoonShine\Resources\TelegraphBot\Pages\TelegraphBotDetailPage;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<TelegraphBot, TelegraphBotIndexPage, TelegraphBotFormPage, TelegraphBotDetailPage>
 */
class TelegraphBotResource extends ModelResource
{
    protected string $model = TelegraphBot::class;

    protected string $title = 'Telegraph боты';

    protected string $column = 'name';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            TelegraphBotIndexPage::class,
            TelegraphBotFormPage::class,
            TelegraphBotDetailPage::class,
        ];
    }

    /**
     * @return string[]
     */
    protected function search(): array
    {
        return [
            'name',
        ];
    }
}
