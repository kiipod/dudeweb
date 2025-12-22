<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Promocode\Pages;

use App\MoonShine\Enums\PromocodeTypeEnum;
use App\MoonShine\Resources\Promocode\PromocodeResource;
use Illuminate\Contracts\Validation\ValidationRule;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Support\ListOf;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\UI\Fields\Enum;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Text;
use Throwable;

/**
 * @extends FormPage<PromocodeResource>
 */
class PromocodeFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make([
                ID::make(),

                BelongsTo::make('Для кого промокод', 'user')
                    ->nullable()
                    ->searchable(),

                Text::make('Название', 'title'),

                Enum::make('Тип скидки', 'type')
                    ->attach(PromocodeTypeEnum::class),

                Number::make('Размер скидки', 'discount_value'),

                Number::make('Количество', 'count')
                    ->buttons(),
            ]),
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
     * @return ListOf
     */
    protected function formButtons(): ListOf
    {
        return parent::formButtons();
    }

    /**
     * @param DataWrapperContract $item
     * @return array|ValidationRule[][]|string[]|\string[][]|\Stringable[][]
     */
    protected function rules(DataWrapperContract $item): array
    {
        return [];
    }

    /**
     * @param  FormBuilder  $component
     *
     * @return FormBuilder
     */
    protected function modifyFormComponent(FormBuilderContract $component): FormBuilderContract
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
