<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;

/** @extends Factory<Plan> */
#[UseModel(Plan::class)]
final class PlanFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true),
            'short_name' => fake()->word(),
            'code' => fake()->unique()->slug(2),
            'description' => fake()->sentence(),
        ];
    }
}
