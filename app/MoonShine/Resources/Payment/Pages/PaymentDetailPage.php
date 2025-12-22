<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Payment\Pages;

use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\UI\Components\Table\TableBuilder;
use MoonShine\Contracts\UI\FieldContract;
use App\MoonShine\Resources\Payment\PaymentResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Url;
use Throwable;

/**
 * @extends DetailPage<PaymentResource>
 */
class PaymentDetailPage extends DetailPage
{
    /**
     * @return list<FieldContract>
     * @throws Throwable
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),

            BelongsTo::make('Пользователь', 'user'),

            Url::make('URL подтверждения', 'confirmation_url'),

            Text::make('Статус', 'status'),

            Number::make('Сумма платежа', 'amount'),

            Text::make('Валюта', 'currency'),

            Text::make('Описание платежа', 'description'),

            Json::make('Мета-данные', 'metadata')
                ->onlyValue(),

            Text::make('Получатель ID', 'recipient_account_id'),

            Text::make('Получатель Gateway ID', 'recipient_gateway_id'),

            Switcher::make('Возврат денег', 'refundable'),

            Switcher::make('Тестовый платеж', 'test'),

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
