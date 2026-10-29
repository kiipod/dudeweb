<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ReferralInvite;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<ReferralInvite> */
#[UseModel(ReferralInvite::class)]
final class ReferralInviteFactory extends Factory
{
    /**
     * Создаёт токен для независимой стабильной remote identity.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'token' => Str::random(40),
            'remnawave_user_id' => fn(): int => User::factory()->create([
                'remnawave_user_id' => fake()->unique()->numberBetween(1, 2_000_000_000),
            ])->remnawave_user_id,
        ];
    }
}
