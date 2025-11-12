<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * @return array
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'category_id' => Category::factory(),
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraphs(2, true),
            'price' => $this->faker->numberBetween(1000, 100000),
        ];
    }

    /**
     * @param Category $category
     * @return $this
     */
    public function forCategory(Category $category): static
    {
        return $this->state(fn(array $attributes) => [
            'category_id' => $category->id,
        ]);
    }

    /**
     * @param int $price
     * @return $this
     */
    public function withPrice(int $price): static
    {
        return $this->state(fn(array $attributes) => [
            'price' => $price,
        ]);
    }
}
