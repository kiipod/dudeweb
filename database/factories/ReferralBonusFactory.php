<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ReferralBonus;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ReferralBonus> */
#[UseModel(ReferralBonus::class)]
final class ReferralBonusFactory extends Factory
{
    /**
     * Формирует редактируемое правило бонуса для проверки live конфигурации.
     *
     * @return array<string, int>
     */
    public function definition(): array
    {
        return ['paid_months' => 1, 'bonus_days' => 7];
    }
}
