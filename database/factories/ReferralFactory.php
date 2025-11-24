<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Referral;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Referral>
 */
class ReferralFactory extends Factory
{
    /**
     * @return array
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'level' => $this->faker->randomElement(['basic', 'advanced']),
            'parent_id' => User::factory(),
            'user_id' => User::factory(),
            'ref_id' => User::factory(),
            'is_paid' => $this->faker->boolean(10),
        ];
    }

    /**
     * @param User $user
     * @param User $referral
     * @return $this
     */
    public function forUsers(User $user, User $referral): static
    {
        return $this->state(fn(array $attributes) => [
            'user_id' => $user->id,
            'ref_id' => $referral->id,
        ]);
    }

    /**
     * @return $this
     */
    public function paid(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_paid' => true,
        ]);
    }
}
