<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Promocode;

use App\Models\Promocode;
use App\MoonShine\Resources\Promocode\Pages\PromocodeIndexPage;
use App\MoonShine\Resources\Promocode\Pages\PromocodeFormPage;
use App\MoonShine\Resources\Promocode\Pages\PromocodeDetailPage;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<Promocode, PromocodeIndexPage, PromocodeFormPage, PromocodeDetailPage>
 */
class PromocodeResource extends ModelResource
{
    protected string $model = Promocode::class;

    protected string $title = 'Промокоды';

    protected string $column = 'title';

    /**
     * Задаёт страницы списка, просмотра и редактирования ресурса.
     *
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            PromocodeIndexPage::class,
            PromocodeFormPage::class,
            PromocodeDetailPage::class,
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
            'user_id',
            'title',
        ];
    }
}
