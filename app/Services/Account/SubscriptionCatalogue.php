<?php

declare(strict_types=1);

namespace App\Services\Account;

use App\Models\Plan;
use App\Models\Product;
use App\Models\Promocode;
use App\Models\User;
use App\Services\PromocodeService;
use Illuminate\Database\Eloquent\Relations\HasMany;

final readonly class SubscriptionCatalogue
{
    /**
     * Принимает единственный источник правил скидок.
     *
     * @param PromocodeService $promocodes
     */
    public function __construct(private PromocodeService $promocodes) {}

    /**
     * Готовит реальные продукты с явными сроками и серверными итогами.
     *
     * @param User $user
     * @param Promocode|null $manual
     *
     * @return array<string, mixed>
     *
     * @throws \DomainException
     */
    public function forUser(User $user, ?Promocode $manual = null): array
    {
        $promo = $this->promocodes->resolveForPayment($user, $manual);
        if ($promo !== null) {
            $this->promocodes->validateForUser($promo, $user);
        }
        $plan = Plan::query()->select(['id', 'name', 'short_name', 'device_limit'])
            ->active()->where('code', 'unlimited')
            ->with(['products' => static function (HasMany $query): void {
                $query->select(['id', 'plan_id', 'name', 'months', 'price'])
                    ->active()->whereIn('months', [1, 3, 6, 12])->where('price', '>', 0)
                    ->orderBy('months')->orderBy('id');
            }])->orderBy('id')->first();

        return [
            'plan' => $plan === null ? null : [
                'id' => $plan->id,
                'name' => $plan->short_name ?: $plan->name,
                'deviceLimit' => $plan->device_limit,
            ],
            'products' => $plan?->products->unique('months')->map(fn(Product $product): array => [
                'id' => $product->id,
                'months' => $product->months,
                'originalAmount' => $product->price,
                'amount' => $promo === null ? $product->price : $this->promocodes->calculatePrice($product->price, $promo),
                'currency' => 'RUB',
            ])->values()->all() ?? [],
            'discount' => $promo === null ? null : [
                'code' => $manual?->title,
                'automatic' => $manual === null,
                'type' => $promo->type,
                'value' => $promo->discount_value,
            ],
        ];
    }
}
