<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\User\Pages;

use Illuminate\Contracts\Validation\ValidationRule;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use App\MoonShine\Resources\User\UserResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;
use Throwable;

/**
 * @extends FormPage<UserResource>
 */
class UserFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make([
                ID::make(),

                Text::make('Имя', 'first_name'),

                Text::make('Фамилия', 'last_name'),

                Text::make('Username', 'username'),

                Text::make('Telegram ID', 'chat_id'),

                Switcher::make('Триал', 'is_trial'),

                Switcher::make('Премиум-пользователь', 'is_premium'),

                Switcher::make('Бесплатно', 'is_free'),

                Date::make('Окончание триала', 'trial_expired')
                    ->withTime(),

                Text::make('Кто пригласил', 'referrer_user_id'),
            ]),
        ];
    }

    /**
     * @return ListOf
     */
    protected function buttons(): ListOf
    {
        return parent::buttons();
    }

    /**
     * @return ListOf
     */
    protected function formButtons(): ListOf
    {
        return parent::formButtons();
    }

    /**
     * @param DataWrapperContract $item
     * @return array|ValidationRule[][]|string[]|\string[][]|\Stringable[][]
     */
    protected function rules(DataWrapperContract $item): array
    {
        return [];
    }

    /**
     * @param  FormBuilder  $component
     *
     * @return FormBuilder
     */
    protected function modifyFormComponent(FormBuilderContract $component): FormBuilderContract
    {
        return $component;
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer(),
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer(),
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer(),
        ];
    }
}
