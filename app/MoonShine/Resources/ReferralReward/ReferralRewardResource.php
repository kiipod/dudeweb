<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ReferralReward;

use App\Models\ReferralReward;
use App\MoonShine\Resources\ReferralReward\Pages\ReferralRewardIndexPage;
use App\MoonShine\Resources\ReferralReward\Pages\ReferralRewardFormPage;
use App\MoonShine\Resources\ReferralReward\Pages\ReferralRewardDetailPage;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<ReferralReward, ReferralRewardIndexPage, ReferralRewardFormPage, ReferralRewardDetailPage>
 */
class ReferralRewardResource extends ModelResource
{
    protected string $model = ReferralReward::class;

    protected string $title = 'Вознаграждения';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ReferralRewardIndexPage::class,
            ReferralRewardFormPage::class,
            ReferralRewardDetailPage::class,
        ];
    }

    /**
     * @return string[]
     */
    protected function search(): array
    {
        return [
            'referrer_user_id',
        ];
    }
}
