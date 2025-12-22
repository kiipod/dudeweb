<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ChatMessage\Pages;

use App\MoonShine\Enums\ChatTypeEnum;
use App\MoonShine\Enums\MessageStatusEnum;
use MoonShine\EasyMde\Fields\Markdown;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\UI\Components\Table\TableBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\QueryTags\QueryTag;
use MoonShine\UI\Components\Metrics\Wrapped\Metric;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Enum;
use MoonShine\UI\Fields\ID;
use App\MoonShine\Resources\ChatMessage\ChatMessageResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\Json;
use Throwable;

/**
 * @extends IndexPage<ChatMessageResource>
 */
class ChatMessageIndexPage extends IndexPage
{
    protected bool $isLazy = true;

    /**
     * @return list<FieldContract>
     * @throws Throwable
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),

            Enum::make('Тип сообщения', 'type')
                ->attach(ChatTypeEnum::class),

            Markdown::make('Сообщение', 'text'),

            Json::make('Placeholders', 'placeholders')
                ->onlyValue(),

            Enum::make('Статус', 'status')
                ->attach(MessageStatusEnum::class),

            Date::make('Запланировано', 'sent_at')
                ->format('d.m.Y, H:i'),

            Date::make('Дата создания', 'created_at')
                ->format('d.m.Y, H:i')
                ->sortable(),
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
     * @return list<FieldContract>
     */
    protected function filters(): iterable
    {
        return [];
    }

    /**
     * @return list<QueryTag>
     */
    protected function queryTags(): array
    {
        return [];
    }

    /**
     * @return list<Metric>
     */
    protected function metrics(): array
    {
        return [];
    }

    /**
     * @param  TableBuilder  $component
     *
     * @return TableBuilder
     */
    protected function modifyListComponent(ComponentContract $component): ComponentContract
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
