<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;

/** @extends Factory<User> */
#[UseModel(User::class)]
final class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'username' => fake()->unique()->userName(),
            'chat_id' => fake()->unique()->numberBetween(100_000, 2_000_000_000),
            'tags' => UserTags::Active,
        ];
    }
}
