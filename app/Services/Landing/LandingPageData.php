<?php

declare(strict_types=1);

namespace App\Services\Landing;

use App\Models\Plan;
use App\Models\Product;
use App\Services\Landing\Enums\PricingState;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\QueryException;

final readonly class LandingPageData
{
    /**
     * Prepare only safe public landing data without user subscription details.
     *
     * @return array{plans: list<array<string, mixed>>, pricingState: string}
     */
    public function get(): array
    {
        $plans = [];
        $pricingState = PricingState::Empty;

        try {
            $plan = Plan::query()->active()->where('code', 'unlimited')
                ->with([
                    'products' => function (HasMany $query): void {
                        $query->active()->whereIn('months', [1, 3, 6, 12])->where('price', '>', 0)
                            ->orderBy('months')->orderBy('id');
                    },
                    'advantages' => fn($query) => $query->orderBy('advantages.id'),
                ])->orderBy('id')->first();

            if ($plan !== null && $plan->products->isNotEmpty()) {
                $plans[] = [
                    'id' => $plan->id,
                    'name' => $plan->short_name ?: $plan->name,
                    'deviceLimit' => $plan->device_limit,
                    'advantages' => $plan->advantages->pluck('title')->all(),
                    'products' => $plan->products->map(fn(Product $product): array => [
                        'id' => $product->id,
                        'months' => $product->months,
                        'priceMinor' => $product->price,
                        'currency' => 'RUB',
                    ])->values()->all(),
                ];
                $pricingState = PricingState::Ready;
            }
        } catch (QueryException $exception) {
            report($exception);
            $pricingState = PricingState::Unavailable;
        }

        return ['plans' => $plans, 'pricingState' => $pricingState->value];
    }
}
