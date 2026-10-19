<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ReferralReward\Pages;

use App\Enums\ReferralRewardStatus;
use App\MoonShine\Resources\User\UserResource;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\QueryTags\QueryTag;
use MoonShine\UI\Components\Metrics\Wrapped\Metric;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Enum;
use MoonShine\UI\Fields\ID;
use App\MoonShine\Resources\ReferralReward\ReferralRewardResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\Number;
use Throwable;

/**
 * @extends IndexPage<ReferralRewardResource>
 */
class ReferralRewardIndexPage extends IndexPage
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

            BelongsTo::make('Кто пригласил', 'user')
                ->sortable(),

            BelongsTo::make(
                'Кого пригласил',
                'referredUser',
                resource: UserResource::class,
            ),

            BelongsTo::make('Платеж ID', 'payment'),

            Number::make('Вознаграждение(дней)', 'days_added'),

            Enum::make('Статус начисления', 'status')
                ->attach(ReferralRewardStatus::class)
                ->sortable(),

            Date::make('Целевая дата подписки', 'target_expires_at')
                ->format('d.m.Y, H:i'),

            Date::make('Начислено', 'applied_at')
                ->format('d.m.Y, H:i'),

            Date::make('Дата создания', 'created_at')
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
