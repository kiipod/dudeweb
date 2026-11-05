<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\MoonShineUser;

use MoonShine\Laravel\Models\MoonshineUser;
use MoonShine\Laravel\Resources\ModelResource;
use App\MoonShine\Resources\MoonShineUser\Pages\MoonShineUserFormPage;
use App\MoonShine\Resources\MoonShineUser\Pages\MoonShineUserIndexPage;
use MoonShine\MenuManager\Attributes\Group;
use MoonShine\MenuManager\Attributes\Order;
use MoonShine\Support\Attributes\Icon;
use MoonShine\Support\Enums\Action;
use MoonShine\Support\ListOf;

/**
 * @extends ModelResource<MoonshineUser, MoonShineUserIndexPage, MoonShineUserFormPage, null>
 */
#[Icon('users')]
#[Group('moonshine::ui.resource.system', 'users', translatable: true)]
#[Order(0)]
class MoonShineUserResource extends ModelResource
{
    protected string $model = MoonshineUser::class;

    protected string $title = 'Администраторы';

    protected string $column = 'name';

    protected array $with = ['moonshineUserRole'];

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
            MoonShineUserIndexPage::class,
            MoonShineUserFormPage::class,
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
