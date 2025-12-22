<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Promocode\Pages;

use App\MoonShine\Enums\PromocodeTypeEnum;
use App\MoonShine\Resources\Promocode\PromocodeResource;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\Support\ListOf;
use MoonShine\UI\Components\Table\TableBuilder;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Enum;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Text;
use Throwable;

/**
 * @extends DetailPage<PromocodeResource>
 */
class PromocodeDetailPage extends DetailPage
{
    /**
     * @return list<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),

            BelongsTo::make('Для кого промокод', 'user'),

            Text::make('Название', 'title'),

            Enum::make('Тип скидки', 'type')
                ->attach(PromocodeTypeEnum::class),

            Number::make('Размер скидки', 'discount_value'),

            Number::make('Количество', 'count'),

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
