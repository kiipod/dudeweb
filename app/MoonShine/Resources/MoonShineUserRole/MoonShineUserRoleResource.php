<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\MoonShineUserRole;

use MoonShine\Laravel\Models\MoonshineUserRole;
use MoonShine\Laravel\Resources\ModelResource;
use App\MoonShine\Resources\MoonShineUserRole\Pages\MoonShineUserRoleFormPage;
use App\MoonShine\Resources\MoonShineUserRole\Pages\MoonShineUserRoleIndexPage;
use MoonShine\MenuManager\Attributes\Group;
use MoonShine\MenuManager\Attributes\Order;
use MoonShine\Support\Attributes\Icon;
use MoonShine\Support\Enums\Action;
use MoonShine\Support\ListOf;

/**
 * @extends ModelResource<MoonshineUserRole, MoonShineUserRoleIndexPage, MoonShineUserRoleFormPage, null>
 */
#[Icon('bookmark')]
#[Group('moonshine::ui.resource.system', 'users', translatable: true)]
#[Order(1)]
class MoonShineUserRoleResource extends ModelResource
{
    protected string $model = MoonshineUserRole::class;

    protected string $title = 'Роли';

    protected string $column = 'name';

    protected bool $createInModal = true;

    protected bool $detailInModal = true;

    protected bool $editInModal = true;

    /**
     * Requires the panel superuser gate for every administrator-management action.
     *
     * @param \MoonShine\Support\Enums\Ability $ability
     *
     * @return bool
     */
    protected function isCan(\MoonShine\Support\Enums\Ability $ability): bool
    {
        $actor = \MoonShine\Laravel\MoonShineAuth::getGuard()->user();
        return $actor !== null
            && \Illuminate\Support\Facades\Gate::forUser($actor)->allows('manage-administrators')
            && parent::isCan($ability);
    }

    /**
     * Ограничивает доступные операции административного ресурса.
     *
     * @return ListOf
     */
    protected function activeActions(): ListOf
    {
        return parent::activeActions()->except(Action::VIEW);
    }

    /**
     * Задаёт страницы списка, просмотра и редактирования ресурса.
     *
     * @return string[]
     */
    protected function pages(): array
    {
        return [
            MoonShineUserRoleIndexPage::class,
            MoonShineUserRoleFormPage::class,
        ];
    }

    /**
     * Определяет поля ресурса, доступные для текстового поиска.
     *
     * @return string[]
     */
    protected function search(): array
    {
        return [
            'id',
            'name',
        ];
    }
}
