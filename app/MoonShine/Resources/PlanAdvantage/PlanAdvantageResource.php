<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PlanAdvantage;

use App\Models\PlanAdvantage;
use App\MoonShine\Resources\PlanAdvantage\Pages\PlanAdvantageIndexPage;
use App\MoonShine\Resources\PlanAdvantage\Pages\PlanAdvantageFormPage;
use App\MoonShine\Resources\PlanAdvantage\Pages\PlanAdvantageDetailPage;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<PlanAdvantage, PlanAdvantageIndexPage, PlanAdvantageFormPage, PlanAdvantageDetailPage>
 */
class PlanAdvantageResource extends ModelResource
{
    protected string $model = PlanAdvantage::class;

    protected string $title = 'Продуктовые преимущества';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            PlanAdvantageIndexPage::class,
            PlanAdvantageFormPage::class,
            PlanAdvantageDetailPage::class,
        ];
    }

    /**
     * @return string[]
     */
    protected function search(): array
    {
        return [
            'plan_id',
            'advantage_id',
        ];
    }
}
