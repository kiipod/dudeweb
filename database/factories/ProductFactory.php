<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Plan;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Product> */
final class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'plan_id' => Plan::factory(),
            'name' => '1 месяц',
            'price' => 20_000,
            'status' => 'active',
        ];
    }
}
