<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ChatMessage\Pages;

use App\MoonShine\Enums\ChatTypeEnum;
use App\MoonShine\Enums\MessageStatusEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use MoonShine\EasyMde\Fields\Markdown;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use App\MoonShine\Resources\ChatMessage\ChatMessageResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Enum;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\UI\Fields\Json;
use Throwable;

/**
 * @extends FormPage<ChatMessageResource>
 */
class ChatMessageFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     * @throws Throwable
     */
    protected function fields(): iterable
    {
        return [
            Box::make([
                ID::make(),

                Enum::make('Тип сообщения', 'type')
                    ->attach(ChatTypeEnum::class)
                    ->nullable(),

                Markdown::make('Сообщение', 'text'),

                Json::make('Placeholders', 'placeholders')
                    ->onlyValue()
                    ->creatable()
                    ->removable()
                    ->reorderable(false),

                Enum::make('Статус', 'status')
                    ->attach(MessageStatusEnum::class)
                    ->nullable(),

                Date::make('Запланировано', 'sent_at')
                    ->withTime()
                    ->format('d.m.Y, H:i')
                    ->showWhen('status', 'in', ['planned']),
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
