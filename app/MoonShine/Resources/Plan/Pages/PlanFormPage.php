<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Plan\Pages;

use App\MoonShine\Enums\StatusEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use MoonShine\EasyMde\Fields\Markdown;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use App\MoonShine\Resources\Plan\PlanResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\Enum;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Text;
use Throwable;

/**
 * @extends FormPage<PlanResource>
 */
class PlanFormPage extends FormPage
{
    /**
     * Описывает поля и компоненты страницы административной панели.
     *
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make([
                ID::make(),

                Text::make('Название', 'name'),

                Text::make('Короткое название', 'short_name'),

                Text::make('Код', 'code'),

                Markdown::make('Описание', 'description'),

                Number::make('Лимит устройств', 'device_limit')
                    ->min(0),

                Enum::make('Статус', 'status')
                    ->attach(StatusEnum::class)
                    ->nullable(),
            ]),
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
     * Сохраняет стандартную реализацию кнопок формы MoonShine.
     *
     * @return ListOf
     */
    protected function formButtons(): ListOf
    {
        return parent::formButtons();
    }

    /**
     * Определяет правила проверки полей административной формы.
     *
     * @param DataWrapperContract $item
     *
     * @return array|ValidationRule[][]|string[]|\string[][]|\Stringable[][]
     */
    protected function rules(DataWrapperContract $item): array
    {
        return [
            'device_limit' => ['required', 'integer', 'min:0'],
        ];
    }

    /**
     * Возвращает компонент страницы без дополнительных изменений.
     *
     * @param FormBuilderContract $component
     *
     * @return FormBuilderContract
     */
    protected function modifyFormComponent(FormBuilderContract $component): FormBuilderContract
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
