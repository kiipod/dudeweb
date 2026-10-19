<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ChatMessage\Pages;

use App\MoonShine\Enums\ChatTypeEnum;
use App\MoonShine\Enums\MessageStatusEnum;
use MoonShine\EasyMde\Fields\Markdown;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use App\MoonShine\Resources\ChatMessage\ChatMessageResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Enum;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Json;
use Throwable;

/**
 * @extends DetailPage<ChatMessageResource>
 */
class ChatMessageDetailPage extends DetailPage
{
    /**
     * Описывает поля и компоненты страницы административной панели.
     *
     * @return list<FieldContract>
     *
     * @throws Throwable
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),

            Enum::make('Тип сообщения', 'type')
                ->attach(ChatTypeEnum::class),

            Markdown::make('Сообщение', 'text'),

            Json::make('Placeholders', 'placeholders')
                ->onlyValue(),

            Enum::make('Статус', 'status')
                ->attach(MessageStatusEnum::class),

            Date::make('Запланировано', 'sent_at')
                ->format('d.m.Y, H:i'),

            Date::make('Дата создания', 'created_at')
                ->format('d.m.Y, H:i'),

            Date::make('Дата обновления', 'updated_at')
                ->format('d.m.Y, H:i'),
        ];
    }

    /**
     * Сохраняет стандартную реализацию действий страницы MoonShine.
     *
     * @return ListOf
     */
    protected function buttons(): ListOf
    {
        return parent::buttons();
    }

    /**
     * Возвращает компонент страницы без дополнительных изменений.
     *
     * @param ComponentContract $component
     *
     * @return ComponentContract
     */
    protected function modifyDetailComponent(ComponentContract $component): ComponentContract
    {
        return $component;
    }

    /**
     * Формирует верхний слой страницы с дополнительными компонентами.
     *
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer(),
        ];
    }

    /**
     * Формирует основной слой страницы с компонентами ресурса.
     *
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer(),
        ];
    }

    /**
     * Формирует нижний слой страницы с дополнительными компонентами.
     *
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer(),
        ];
    }
}
