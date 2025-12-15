<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Promocode;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Promocode>
 */
class PromocodeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => $this->faker->uuid(),
            'user_id' => User::factory(),
            'title' => strtoupper($this->faker->lexify('??????')),
            'discount' => $this->faker->numberBetween(5, 50),
            'amount' => $this->faker->optional(0.7)->numberBetween(10, 100),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    // Состояния для различных сценариев
    public function withoutUser(): Factory|PromocodeFactory
    {
        return $this->state(function (array $attributes) {
            return [
                'user_id' => null,
            ];
        });
    }

    public function unlimited(): Factory|PromocodeFactory
    {
        return $this->state(function (array $attributes) {
            return [
                'amount' => null,
            ];
        });
    }

    public function withSpecificDiscount(int $discount): Factory|PromocodeFactory
    {
        return $this->state(function (array $attributes) use ($discount) {
            return [
                'discount' => $discount,
            ];
        });
    }
}
