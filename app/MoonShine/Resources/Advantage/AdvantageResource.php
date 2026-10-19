<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Advantage;

use App\Models\Advantage;
use App\MoonShine\Resources\Advantage\Pages\AdvantageIndexPage;
use App\MoonShine\Resources\Advantage\Pages\AdvantageFormPage;
use App\MoonShine\Resources\Advantage\Pages\AdvantageDetailPage;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<Advantage, AdvantageIndexPage, AdvantageFormPage, AdvantageDetailPage>
 */
class AdvantageResource extends ModelResource
{
    protected string $model = Advantage::class;

    protected string $title = 'Список преимуществ';

    protected string $column = 'title';

    /**
     * Задаёт страницы списка, просмотра и редактирования ресурса.
     *
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            AdvantageIndexPage::class,
            AdvantageFormPage::class,
            AdvantageDetailPage::class,
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
            'title',
        ];
    }
}
