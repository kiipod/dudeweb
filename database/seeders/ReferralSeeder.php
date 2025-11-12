<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Referral;
use Illuminate\Database\Seeder;

class ReferralSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Referral::factory(10)->create();
    }
}
