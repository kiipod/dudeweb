<?php

declare(strict_types=1);

namespace App\Services;

use App\Bot\Telegram\Enums\ChatMessageType;
use App\Models\Plan;
use App\Models\Promocode;

final readonly class PlanMessageService
{
    /**
     * Принимает зависимости для работы PlanMessageService.
     *
     * @param PromocodeService $promocodeService
     * @param MessageTemplateService $messageTemplateService
     */
    public function __construct(
        private PromocodeService $promocodeService,
        private MessageTemplateService $messageTemplateService,
    ) {}

    /**
     * Метод возвращает сообщение о тарифах
     *
     * @param Promocode|null $promocode
     *
     * @return string
     */
    public function plansOverview(?Promocode $promocode = null): string
    {
        $plans = Plan::with('products')->active()->get();

        $message = $this->messageTemplateService->getFormattedMessage(
            ChatMessageType::Plans->value,
        );

        foreach ($plans as $plan) {
            $minPrice = $plan->products->min('price') / 100;

            $message .= "\n\n✅ *{$plan->name}* — {$plan->description}";
            $message .= "\n💰 от *{$minPrice} ₽/месяц*";
        }

        if ($promocode !== null) {
            $message .= "\n\n🎁 Промокод *{$promocode->title}* применён."
                . ' Скидка будет учтена после выбора тарифа.';
        }

        $message .= "\n\n⚠️ Без автосписаний и привязки карт.";

        return $message;
    }

    /**
     * Метод возвращает детальную страницу с информацией о выбранном тарифе
     *
     * @param string $code
     * @param Promocode|null $promocode
     *
     * @return string
     */
    public function planDetails(string $code, ?Promocode $promocode = null): string
    {
        $plan = Plan::where('code', $code)
            ->with(['advantages', 'products'])
            ->firstOrFail();

        $message = '<b>' . e($plan->name) . '.</b>';
        $message .= "\n\n<b>Что вы получите:</b>";

        foreach ($plan->advantages as $advantage) {
            $message .= "\n• " . e($advantage->title);
        }

        $message .= "\n\n<b>Тарифы:</b>";

        foreach ($plan->products as $product) {
            $price = $product->price;
            $productName = e($product->name);

            if ($promocode) {
                $original = $product->price;
                $discounted = $this->promocodeService
                    ->calculatePrice($original, $promocode);

                $originalPrice = (int) round($original / 100);
                $discountedPrice = (int) round($discounted / 100);

                $message .= "\n{$productName}: <s>{$originalPrice} ₽</s>"
                    . " → <b>{$discountedPrice} ₽</b>";
            } else {
                $message .= "\n{$productName}: <b>" . ($price / 100) . ' ₽</b>';
            }
        }

        if ($promocode) {
            $discount = match ($promocode->type) {
                'percent' => "{$promocode->discount_value}%",
                'fixed'   => ($promocode->discount_value / 100) . ' ₽',
                default   => null,
            };

            $message .= "\n\n🎁 Промокод <b>" . e($promocode->title) . '</b> применён.';

            if ($discount !== null) {
                $message .= " Скидка: <b>{$discount}</b>.";
            }
        }

        return $message;
    }
}
