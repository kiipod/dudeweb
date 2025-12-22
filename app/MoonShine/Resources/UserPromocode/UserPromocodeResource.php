<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\UserPromocode;

use App\Models\UserPromocode;
use App\MoonShine\Resources\UserPromocode\Pages\UserPromocodeIndexPage;
use App\MoonShine\Resources\UserPromocode\Pages\UserPromocodeFormPage;
use App\MoonShine\Resources\UserPromocode\Pages\UserPromocodeDetailPage;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<UserPromocode, UserPromocodeIndexPage, UserPromocodeFormPage, UserPromocodeDetailPage>
 */
class UserPromocodeResource extends ModelResource
{
    protected string $model = UserPromocode::class;

    protected string $title = 'Примененные промокоды';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            UserPromocodeIndexPage::class,
            UserPromocodeFormPage::class,
            UserPromocodeDetailPage::class,
        ];
    }

    /**
     * @return string[]
     */
    protected function search(): array
    {
        return [
            'user_id',
            'promocode_id',
        ];
    }
}
