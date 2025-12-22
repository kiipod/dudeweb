<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Plan;

use App\Models\Plan;
use App\MoonShine\Resources\Plan\Pages\PlanIndexPage;
use App\MoonShine\Resources\Plan\Pages\PlanFormPage;
use App\MoonShine\Resources\Plan\Pages\PlanDetailPage;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<Plan, PlanIndexPage, PlanFormPage, PlanDetailPage>
 */
class PlanResource extends ModelResource
{
    protected string $model = Plan::class;

    protected string $title = 'Тарифы';

    protected string $column = 'short_name';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            PlanIndexPage::class,
            PlanFormPage::class,
            PlanDetailPage::class,
        ];
    }

    /**
     * @return string[]
     */
    protected function search(): array
    {
        return [
            'name',
            'short_name',
            'description',
            'code',
        ];
    }
}
