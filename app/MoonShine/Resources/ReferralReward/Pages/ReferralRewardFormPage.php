<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ReferralReward\Pages;

use App\MoonShine\Resources\User\UserResource;
use Illuminate\Contracts\Validation\ValidationRule;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use App\MoonShine\Resources\ReferralReward\ReferralRewardResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\UI\Fields\Number;
use Throwable;

/**
 * @extends FormPage<ReferralRewardResource>
 */
class ReferralRewardFormPage extends FormPage
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

                BelongsTo::make('Кто пригласил', 'user')
                    ->nullable()
                    ->searchable(),

                BelongsTo::make(
                    'Кого пригласил',
                    'referredUser',
                    resource: UserResource::class,
                )
                    ->nullable()
                    ->searchable(),

                BelongsTo::make('Платеж ID', 'payment')
                    ->nullable()
                    ->searchable(),

                Number::make('Вознаграждение(дней)', 'days_added')
                    ->buttons(),
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
        return [];
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
