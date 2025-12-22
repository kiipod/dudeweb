<?php

declare(strict_types=1);

namespace App\MoonShine\Layouts;

use App\MoonShine\Resources\MoonShineUser\MoonShineUserResource;
use App\MoonShine\Resources\MoonShineUserRole\MoonShineUserRoleResource;
use MoonShine\Contracts\MenuManager\MenuElementContract;
use MoonShine\Laravel\Layouts\AppLayout;
use MoonShine\ColorManager\Palettes\PurplePalette;
use MoonShine\ColorManager\ColorManager;
use MoonShine\Contracts\ColorManager\ColorManagerContract;
use MoonShine\Contracts\ColorManager\PaletteContract;
use MoonShine\MenuManager\MenuGroup;
use MoonShine\UI\Components\Layout\Footer;
use App\MoonShine\Resources\Advantage\AdvantageResource;
use MoonShine\MenuManager\MenuItem;
use App\MoonShine\Resources\ChatMessage\ChatMessageResource;
use App\MoonShine\Resources\PlanAdvantage\PlanAdvantageResource;
use App\MoonShine\Resources\Plan\PlanResource;
use App\MoonShine\Resources\Product\ProductResource;
use App\MoonShine\Resources\Promocode\PromocodeResource;
use App\MoonShine\Resources\ReferralReward\ReferralRewardResource;
use App\MoonShine\Resources\TelegraphBot\TelegraphBotResource;
use App\MoonShine\Resources\TelegraphChat\TelegraphChatResource;
use App\MoonShine\Resources\UserPromocode\UserPromocodeResource;
use App\MoonShine\Resources\User\UserResource;
use App\MoonShine\Resources\Payment\PaymentResource;

final class MoonShineLayout extends AppLayout
{
    /**
     * @var null|class-string<PaletteContract>
     */
    protected ?string $palette = PurplePalette::class;

    /**
     * @return array
     */
    protected function assets(): array
    {
        return [
            ...parent::assets(),
        ];
    }

    /**
     * @return array|MenuElementContract[]
     */
    protected function menu(): array
    {
        return [
            MenuGroup::make('Настройки', [
                MenuItem::make(MoonShineUserResource::class, 'Администраторы'),
                MenuItem::make(MoonShineUserRoleResource::class, 'Роли'),
            ]),
            MenuGroup::make('Пользователи', [
                MenuItem::make(UserResource::class, 'Список'),
                MenuItem::make(ReferralRewardResource::class, 'Вознаграждения'),
            ]),
            MenuGroup::make('Промокоды', [
                MenuItem::make(PromocodeResource::class, 'Промокоды'),
                MenuItem::make(UserPromocodeResource::class, 'Примененные промокоды'),
            ]),
            MenuGroup::make('Telegraph', [
                MenuItem::make(TelegraphBotResource::class, 'Бот'),
                MenuItem::make(TelegraphChatResource::class, 'Чаты'),
                MenuItem::make(ChatMessageResource::class, 'Сообщения чата'),
            ]),
            MenuGroup::make('Тарифы', [
                MenuItem::make(PlanResource::class, 'Список'),
                MenuItem::make(ProductResource::class, 'Продукты'),
                MenuItem::make(AdvantageResource::class, 'Список преимуществ'),
                MenuItem::make(PlanAdvantageResource::class, 'Продуктовые преимущества'),
            ]),
            MenuGroup::make('Платежи', [
                MenuItem::make(PaymentResource::class, 'Список'),
            ]),
        ];
    }

    /**
     * @param ColorManager $colorManager
     */
    protected function colors(ColorManagerContract $colorManager): void
    {
        parent::colors($colorManager);

        // $colorManager->primary('#00000');
    }

    /**
     * @return string
     */
    protected function getFooterCopyright(): string
    {
        return \sprintf(
            <<<'HTML'
                &copy; %d Made with ❤️ by
                <a href="https://t.me/kiipod/"
                    class="font-semibold text-primary hover:text-secondary"
                    target="_blank"
                >
                    dude
                </a>
                HTML,
            now()->year,
        );
    }

    /**
     * @return Footer
     */
    protected function getFooterComponent(): Footer
    {
        return Footer::make()
            ->copyright($this->getFooterCopyright());
    }
}
