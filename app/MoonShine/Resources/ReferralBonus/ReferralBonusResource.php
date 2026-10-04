<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ReferralBonus;

use App\Models\ReferralBonus;
use App\MoonShine\Resources\ReferralBonus\Pages\ReferralBonusIndexPage;
use App\MoonShine\Resources\ReferralBonus\Pages\ReferralBonusFormPage;
use App\MoonShine\Resources\ReferralBonus\Pages\ReferralBonusDetailPage;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Support\Enums\SortDirection;

/**
 * @extends ModelResource<ReferralBonus, ReferralBonusIndexPage, ReferralBonusFormPage, ReferralBonusDetailPage>
 */
class ReferralBonusResource extends ModelResource
{
    protected string $model = ReferralBonus::class;

    protected string $title = 'Бонусы реферальной программы';

    protected string $column = 'bonus_days';

    protected SortDirection $sortDirection = SortDirection::ASC;

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ReferralBonusIndexPage::class,
            ReferralBonusFormPage::class,
            ReferralBonusDetailPage::class,
        ];
    }
}
