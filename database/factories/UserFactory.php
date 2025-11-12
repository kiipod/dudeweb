<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * @return array
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'username' => $this->faker->userName(),
            'chat_id' => $this->faker->unique()->numerify('##########'),
            'is_premium' => $this->faker->boolean(20),
            'is_free' => $this->faker->boolean(10),
        ];
    }

    /**
     * @return $this
     */
    public function premium(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_premium' => true,
        ]);
    }

    /**
     * @return $this
     */
    public function unlimited(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_free' => true,
        ]);
    }
}
