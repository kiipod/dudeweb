<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * @return array
     */
    public function definition(): array
    {
        $name = $this->faker->words(2, true);

        return [
            'id' => Str::uuid(),
            'name' => $name,
            'code' => Str::slug($name),
        ];
    }

    /**
     * @param string $name
     * @return $this
     */
    public function withName(string $name): static
    {
        return $this->state(fn(array $attributes) => [
            'name' => $name,
            'code' => Str::slug($name),
        ]);
    }
}
