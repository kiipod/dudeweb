<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\User;

use App\Models\User;
use App\MoonShine\Resources\User\Pages\UserIndexPage;
use App\MoonShine\Resources\User\Pages\UserFormPage;
use App\MoonShine\Resources\User\Pages\UserDetailPage;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<User, UserIndexPage, UserFormPage, UserDetailPage>
 */
class UserResource extends ModelResource
{
    protected string $model = User::class;

    protected string $title = 'Пользователи';

    protected string $column = 'username';

    /**
     * Метод возвращает страницы ресурса
     *
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            UserIndexPage::class,
            UserFormPage::class,
            UserDetailPage::class,
        ];
    }

    /**
     * Метод возвращает поля по которым производится поиск
     *
     * @return string[]
     */
    protected function search(): array
    {
        return [
            'first_name',
            'last_name',
            'username',
            'chat_id',
        ];
    }
}
