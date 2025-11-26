<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Payment;
use App\Models\ReferralReward;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ReferralReward>
 */
class ReferralRewardFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid()->toString(),
            'referrer_user_id' => User::factory(),
            'referred_user_id' => User::factory(),
            'payment_id' => Payment::factory(),
            'days_added' => $this->faker->numberBetween(7, 7),
        ];
    }
}
