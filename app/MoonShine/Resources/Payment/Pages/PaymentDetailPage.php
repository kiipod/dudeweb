<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Payment\Pages;

use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\Contracts\UI\ComponentContract;
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
     * Описывает поля и компоненты страницы административной панели.
     *
     * @return list<FieldContract>
     *
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
     * Сохраняет стандартную реализацию действий страницы MoonShine.
     *
     * @return ListOf
     */
    protected function buttons(): ListOf
    {
        return parent::buttons();
    }

    /**
     * Возвращает компонент страницы без дополнительных изменений.
     *
     * @param ComponentContract $component
     *
     * @return ComponentContract
     */
    protected function modifyDetailComponent(ComponentContract $component): ComponentContract
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
