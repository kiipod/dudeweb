<?php

declare(strict_types=1);

namespace Database\Seeders;
use App\Models\ReferralReward;
use Illuminate\Database\Seeder;

class ReferralRewardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ReferralReward::factory(10)->create();
    }
}
