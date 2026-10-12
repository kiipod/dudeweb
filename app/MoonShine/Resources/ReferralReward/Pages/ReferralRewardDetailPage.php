<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ReferralReward\Pages;

use App\Enums\ReferralRewardStatus;
use App\MoonShine\Resources\User\UserResource;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\UI\Components\Table\TableBuilder;
use MoonShine\Contracts\UI\FieldContract;
use App\MoonShine\Resources\ReferralReward\ReferralRewardResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Enum;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Text;
use Throwable;

/**
 * @extends DetailPage<ReferralRewardResource>
 */
class ReferralRewardDetailPage extends DetailPage
{
    /**
     * @return list<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),

            BelongsTo::make('Кто пригласил', 'user'),

            BelongsTo::make(
                'Кого пригласил',
                'referredUser',
                resource: UserResource::class,
            ),

            BelongsTo::make('Платеж ID', 'payment'),

            Number::make('Вознаграждение(дней)', 'days_added'),

            Enum::make('Статус начисления', 'status')
                ->attach(ReferralRewardStatus::class),

            Date::make('Remote дата до начисления', 'remote_expires_at_before')
                ->format('d.m.Y, H:i'),

            Date::make('Целевая дата подписки', 'target_expires_at')
                ->format('d.m.Y, H:i'),

            Date::make('Начислено', 'applied_at')
                ->format('d.m.Y, H:i'),

            Number::make('Попытки', 'attempts'),

            Text::make('Последняя ошибка', 'last_error'),

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
