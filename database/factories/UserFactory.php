<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;
use Illuminate\Support\Str;
use App\Services\Auth\ProvisioningState;

/** @extends Factory<User> */
#[UseModel(User::class)]
final class UserFactory extends Factory
{
    /** @return array<string, mixed> */
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

    /** @return static */
    public function web(): static
    {
        return $this->state(fn(): array => [
            'username' => null,
            'chat_id' => null,
            'email' => fake()->unique()->safeEmail(),
            'password' => 'password123',
            'tags' => UserTags::Inactive,
            'provisioning_key' => 'web_' . str_replace('-', '', (string) Str::uuid()),
            'provisioning_state' => ProvisioningState::Pending,
        ]);
    }
}
