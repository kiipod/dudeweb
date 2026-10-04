<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\User;
use App\Remnawave\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<User> */
final class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'username' => fake()->unique()->userName(),
            'chat_id' => fake()->unique()->numberBetween(100_000, 2_000_000_000),
            'status' => UserStatus::Active,
            'tags' => UserTags::Active,
        ];
    }
}
