<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Promocode\Pages;

use App\MoonShine\Enums\PromocodeTypeEnum;
use App\MoonShine\Resources\Promocode\PromocodeResource;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Laravel\QueryTags\QueryTag;
use MoonShine\Support\ListOf;
use MoonShine\UI\Components\Metrics\Wrapped\Metric;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Enum;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Text;
use Throwable;

/**
 * @extends IndexPage<PromocodeResource>
 */
class PromocodeIndexPage extends IndexPage
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

            Text::make('Для кого промокод', 'user_id'),

            Text::make('Название', 'title'),

            Enum::make('Тип скидки', 'type')
                ->attach(PromocodeTypeEnum::class)
                ->sortable(),

            Number::make('Размер скидки', 'discount_value')
                ->sortable(),

            Number::make('Количество', 'count')
                ->sortable(),

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
