<?php

declare(strict_types=1);

namespace App\MoonShine\Pages;

use MoonShine\Laravel\Pages\Page;
use MoonShine\Contracts\UI\ComponentContract;

#[\MoonShine\MenuManager\Attributes\SkipMenu]
class Dashboard extends Page
{
    /**
     * Возвращает навигационную цепочку страницы.
     *
     * @return array<string, string>
     */
    public function getBreadcrumbs(): array
    {
        return [
            '#' => $this->getTitle(),
        ];
    }

    /**
     * Возвращает заголовок страницы административной панели.
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title ?: 'Дашборд';
    }

    /**
     * Формирует содержимое главной страницы административной панели.
     *
     * @return list<ComponentContract>
     */
    protected function components(): iterable
    {
        return [];
    }
}
