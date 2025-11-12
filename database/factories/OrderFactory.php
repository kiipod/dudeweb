<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * @return array
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'user_id' => User::factory(),
            'product_id' => Product::factory(),
            'name' => $this->faker->words(3, true),
            'amount' => $this->faker->numberBetween(1000, 50000),
            'currency' => $this->faker->randomElement(['USD', 'EUR', 'RUB']),
        ];
    }

    /**
     * @param User $user
     * @return $this
     */
    public function forUser(User $user): static
    {
        return $this->state(fn(array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    /**
     * @param Product $product
     * @return $this
     */
    public function forProduct(Product $product): static
    {
        return $this->state(fn(array $attributes) => [
            'product_id' => $product->id,
            'amount' => $product->price,
        ]);
    }

    /**
     * @param string $currency
     * @return $this
     */
    public function withCurrency(string $currency): static
    {
        return $this->state(fn(array $attributes) => [
            'currency' => $currency,
        ]);
    }
}
