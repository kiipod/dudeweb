<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\TelegraphChat\Pages;

use App\MoonShine\Resources\TelegraphBot\TelegraphBotResource;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\QueryTags\QueryTag;
use MoonShine\UI\Components\Metrics\Wrapped\Metric;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\ID;
use App\MoonShine\Resources\TelegraphChat\TelegraphChatResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\Text;
use Throwable;

/**
 * @extends IndexPage<TelegraphChatResource>
 */
class TelegraphChatIndexPage extends IndexPage
{
    protected bool $isLazy = true;

    /**
     * Описывает поля и компоненты страницы административной панели.
     *
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
                ->format('d.m.Y, H:i')
                ->sortable(),
        ];
    }

    /**
     * Сохраняет стандартную реализацию действий страницы MoonShine.
     *
     * @return ListOf
     */
    protected function buttons(): ListOf
    {
        return parent::buttons();
    }

    /**
     * Задаёт фильтры списка административного ресурса.
     *
     * @return list<FieldContract>
     */
    protected function filters(): iterable
    {
        return [];
    }

    /**
     * Задаёт предустановленные выборки списка.
     *
     * @return list<QueryTag>
     */
    protected function queryTags(): array
    {
        return [];
    }

    /**
     * Задаёт показатели над списком ресурса.
     *
     * @return list<Metric>
     */
    protected function metrics(): array
    {
        return [];
    }

    /**
     * Возвращает компонент страницы без дополнительных изменений.
     *
     * @param ComponentContract $component
     *
     * @return ComponentContract
     */
    protected function modifyListComponent(ComponentContract $component): ComponentContract
    {
        return $component;
    }

    /**
     * Формирует верхний слой страницы с дополнительными компонентами.
     *
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer(),
        ];
    }

    /**
     * Формирует основной слой страницы с компонентами ресурса.
     *
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer(),
        ];
    }

    /**
     * Формирует нижний слой страницы с дополнительными компонентами.
     *
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer(),
        ];
    }
}
