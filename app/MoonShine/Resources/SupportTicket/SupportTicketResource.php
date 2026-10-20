<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\SupportTicket;

use App\Models\SupportTicket;
use App\MoonShine\Resources\SupportTicket\Pages\SupportTicketDetailPage;
use App\MoonShine\Resources\SupportTicket\Pages\SupportTicketIndexPage;
use Illuminate\Contracts\Database\Eloquent\Builder;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Support\Enums\Action;
use MoonShine\Support\ListOf;

/** @extends ModelResource<SupportTicket, SupportTicketIndexPage, null, SupportTicketDetailPage> */
final class SupportTicketResource extends ModelResource
{
    protected string $model = SupportTicket::class;
    protected string $title = 'Обращения поддержки';
    protected string $column = 'subject';
    protected bool $withPolicy = true;

    /**
     * Регистрирует только list/detail, без generic edit/create/delete.
     *
     * @return array<class-string>
     */
    protected function pages(): array
    {
        return [SupportTicketIndexPage::class, SupportTicketDetailPage::class];
    }

    /**
     * Исключает обход domain service через generic resource mutations.
     *
     * @return ListOf
     */
    protected function activeActions(): ListOf
    {
        return parent::activeActions()->except(Action::CREATE, Action::UPDATE, Action::DELETE, Action::MASS_DELETE);
    }

    /**
     * Загружает customer одним join-free eager query и задаёт stable ordering.
     *
     * @param Builder $builder
     *
     * @return Builder
     */
    protected function modifyQueryBuilder(Builder $builder): Builder
    {
        return $builder->with('user:id,email')->orderByDesc('last_activity_at')->orderByDesc('id');
    }
}
