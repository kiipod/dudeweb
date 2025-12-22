<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\TelegraphChat\Pages;

use App\MoonShine\Resources\TelegraphBot\TelegraphBotResource;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\UI\Components\Table\TableBuilder;
use MoonShine\Contracts\UI\FieldContract;
use App\MoonShine\Resources\TelegraphChat\TelegraphChatResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use Throwable;

/**
 * @extends DetailPage<TelegraphChatResource>
 */
class TelegraphChatDetailPage extends DetailPage
{
    /**
     * @return list<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),

            Text::make('Чат ID', 'chat_id'),

            Text::make('Username', 'name'),

            BelongsTo::make(
                'Бот',
                'bot',
                resource: TelegraphBotResource::class,
            ),

            Date::make('Дата создания', 'created_at')
                ->format('d.m.Y, H:i'),

            Date::make('Дата обновления', 'updated_at')
                ->format('d.m.Y, H:i'),
        ];
    }

    /**
     * @return ListOf
     */
    protected function buttons(): ListOf
    {
        return parent::buttons();
    }

    /**
     * @param  TableBuilder  $component
     *
     * @return TableBuilder
     */
    protected function modifyDetailComponent(ComponentContract $component): ComponentContract
    {
        return $component;
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer(),
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer(),
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer(),
        ];
    }
}
