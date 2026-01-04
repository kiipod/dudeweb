<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Plan;
use App\Models\Promocode;

final class PlanMessageService
{
    /**
     * @param PromocodeService $promocodeService
     */
    public function __construct(private PromocodeService $promocodeService) {}

    /**
     * Метод возвращает сообщение о тарифах
     *
     * @return string
     */
    public function plansOverview(): string
    {
        $plans = Plan::with('products')->active()->get();

        $message = "В *dudeweb* доступно несколько тарифов для доступа к сервису.";

        foreach ($plans as $plan) {
            $minPrice = $plan->products->min('price') / 100;

            $message .= "\n\n✅ *{$plan->name}* — {$plan->description}";
            $message .= "\n💰 от *{$minPrice} ₽/месяц*";
        }

        $message .= "\n\n⚠️ Без автосписаний и привязки карт.";

        return $message;
    }

    /**
     * Метод возвращает детальную страницу с информацией о выбранном тарифе
     *
     * @param string $code
     * @param Promocode|null $promocode
     * @return string
     */
    public function planDetails(string $code, ?Promocode $promocode = null): string
    {
        $plan = Plan::where('code', $code)
            ->with(['advantages', 'products'])
            ->firstOrFail();

        $message = "*{$plan->name}.*";
        $message .= "\n\n*Что вы получите:*";

        foreach ($plan->advantages as $advantage) {
            $message .= "\n• {$advantage->title}";
        }

        $message .= "\n\n*Тарифы:*";

        foreach ($plan->products as $product) {
            $price = $product->price;

            if ($promocode) {
                $original = $product->price;
                $discounted = $this->promocodeService
                    ->calculatePrice($original, $promocode);

                $discountedPrice = (int) round($discounted / 100);
                $label = match ($promocode->type) {
                    'percent' => "-{$promocode->discount_value}%",
                    'fixed'   => '-' . ($promocode->discount_value / 100) . ' ₽',
                    default   => '',
                };

                $message .= "\n{$product->name} ➜ *{$discountedPrice} ₽* ({$label})";
            } else {
                $message .= "\n{$product->name} ➜ *" . ($price / 100) . " ₽*";
            }
        }

        if ($promocode) {
            $message .= "\n\n🎁 Промокод *{$promocode->title}* применён";
        }

        return $message;
    }
}
