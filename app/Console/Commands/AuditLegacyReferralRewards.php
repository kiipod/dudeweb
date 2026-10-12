<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\LegacyReferralRewardAuditService;
use Illuminate\Console\Command;

final class AuditLegacyReferralRewards extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'referrals:audit-legacy';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Compare legacy referral rewards with current Remnawave expiration dates';

    /**
     * Execute the console command.
     *
     * @param LegacyReferralRewardAuditService $auditService
     * @return int
     */
    public function handle(LegacyReferralRewardAuditService $auditService): int
    {
        $result = $auditService->audit();

        if ($result['rows'] === []) {
            $this->info('No legacy referral rewards found.');

            return self::SUCCESS;
        }

        $this->table([
            'Referrer ID',
            'Username',
            'Rewards',
            'Bonus days',
            'Legacy local expiration',
            'Remnawave expiration',
            'Proposed expiration',
            'Error',
        ], array_map(static fn(array $row): array => [
            $row['referrer_id'],
            $row['username'],
            $row['rewards'],
            $row['bonus_days'],
            $row['legacy_local_expires_at'],
            $row['remote_expires_at'],
            $row['proposed_expires_at'],
            $row['error'],
        ], $result['rows']));

        if ($result['failed'] > 0) {
            $this->error("Legacy referral reward audits failed: {$result['failed']}.");

            return self::FAILURE;
        }

        $this->info('Dry run only: no referral rewards or subscriptions were changed.');

        return self::SUCCESS;
    }
}
