<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Payment\Pages;

use Illuminate\Contracts\Validation\ValidationRule;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use App\MoonShine\Resources\Payment\PaymentResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Url;
use Throwable;

/**
 * @extends FormPage<PaymentResource>
 */
class PaymentFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     * @throws Throwable
     */
    protected function fields(): iterable
    {
        return [
            Box::make([
                ID::make(),

                BelongsTo::make('Пользователь', 'user')
                    ->nullable()
                    ->searchable(),

                Url::make('URL подтверждения', 'confirmation_url'),

                Text::make('Статус', 'status'),

                Number::make('Сумма платежа', 'amount'),

                Text::make('Валюта', 'currency'),

                Text::make('Описание платежа', 'description'),

                Json::make('Мета-данные', 'metadata')
                    ->onlyValue()
                    ->creatable()
                    ->removable(),

                Text::make('Получатель ID', 'recipient_account_id'),

                Text::make('Получатель Gateway ID', 'recipient_gateway_id'),

                Switcher::make('Возврат денег', 'refundable'),

                Switcher::make('Тестовый платеж', 'test'),
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
