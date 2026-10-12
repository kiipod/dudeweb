<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\ReferralRewardProcessor;
use Illuminate\Console\Command;

final class ProcessReferralRewards extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'referrals:process-rewards';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Apply pending referral rewards to Remnawave and deliver notifications';

    /**
     * Execute the console command.
     *
     * @param ReferralRewardProcessor $processor
     * @return int
     */
    public function handle(ReferralRewardProcessor $processor): int
    {
        $result = $processor->processDue();

        $this->info("Referral rewards processed: {$result['processed']}.");
        $this->info("Referral rewards applied: {$result['applied']}.");
        $this->info("Referral reward notifications sent: {$result['notified']}.");

        if ($result['conflicts'] > 0) {
            $this->error("Referral reward conflicts: {$result['conflicts']}.");
        }

        if ($result['failed'] > 0) {
            $this->error("Referral reward failures: {$result['failed']}.");
        }

        return $result['conflicts'] === 0 && $result['failed'] === 0
            ? self::SUCCESS
            : self::FAILURE;
    }
}
