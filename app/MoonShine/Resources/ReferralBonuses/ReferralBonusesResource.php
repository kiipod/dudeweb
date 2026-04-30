<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ReferralBonuses;

use App\Models\ReferralBonuses;
use App\MoonShine\Resources\ReferralBonuses\Pages\ReferralBonusesIndexPage;
use App\MoonShine\Resources\ReferralBonuses\Pages\ReferralBonusesFormPage;
use App\MoonShine\Resources\ReferralBonuses\Pages\ReferralBonusesDetailPage;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Support\Enums\SortDirection;

/**
 * @extends ModelResource<ReferralBonuses, ReferralBonusesIndexPage, ReferralBonusesFormPage, ReferralBonusesDetailPage>
 */
class ReferralBonusesResource extends ModelResource
{
    protected string $model = ReferralBonuses::class;

    protected string $title = 'Бонусы реферальной программы';

    protected string $column = 'bonus_days';

    protected SortDirection $sortDirection = SortDirection::ASC;

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ReferralBonusesIndexPage::class,
            ReferralBonusesFormPage::class,
            ReferralBonusesDetailPage::class,
        ];
    }
}
