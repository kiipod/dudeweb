<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ReferralRewardStatus;
use App\Models\ReferralReward;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ReferralReward> */
#[UseModel(ReferralReward::class)]
final class ReferralRewardFactory extends Factory
{
    /**
     * Формирует отдельную reward operation с собственным payment.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'referrer_user_id' => User::factory(),
            'referred_user_id' => User::factory(),
            'payment_id' => fn(array $data): int => PaymentFactory::new()->create(['user_id' => $data['referred_user_id']])->id,
            'days_added' => 7,
            'status' => ReferralRewardStatus::Pending,
        ];
    }
}
