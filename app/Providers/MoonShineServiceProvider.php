<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use MoonShine\Contracts\Core\DependencyInjection\CoreContract;
use MoonShine\Laravel\DependencyInjection\MoonShineConfigurator;
use App\MoonShine\Resources\MoonShineUser\MoonShineUserResource;
use App\MoonShine\Resources\MoonShineUserRole\MoonShineUserRoleResource;
use App\MoonShine\Resources\Advantage\AdvantageResource;
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

class MoonShineServiceProvider extends ServiceProvider
{
    /**
     * @param  CoreContract<MoonShineConfigurator>  $core
     */
    public function boot(CoreContract $core): void
    {
        $core
            ->resources([
                MoonShineUserResource::class,
                MoonShineUserRoleResource::class,
                AdvantageResource::class,
                ChatMessageResource::class,
                PlanAdvantageResource::class,
                PlanResource::class,
                ProductResource::class,
                PromocodeResource::class,
                ReferralRewardResource::class,
                TelegraphBotResource::class,
                TelegraphChatResource::class,
                UserPromocodeResource::class,
                UserResource::class,
                PaymentResource::class,
            ])
            ->pages([
                ...$core->getConfig()->getPages(),
            ])
        ;
    }
}
