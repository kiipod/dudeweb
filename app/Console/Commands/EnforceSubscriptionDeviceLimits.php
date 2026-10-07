<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\DeviceLimitEnforcementService;
use Illuminate\Console\Command;
use Throwable;

final class EnforceSubscriptionDeviceLimits extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:enforce-device-limits';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Disable subscriptions that exceed their plan device limit';

    /**
     * Execute the console command.
     *
     * @param DeviceLimitEnforcementService $enforcementService
     * @return int
     * @throws Throwable
     */
    public function handle(DeviceLimitEnforcementService $enforcementService): int
    {
        $result = $enforcementService->enforce();

        $this->info("Device limits checked: {$result['checked']}.");
        $this->info("Subscriptions disabled: {$result['disabled']}.");
        $this->info("Subscriptions recovered: {$result['recovered']}.");
        $this->info("Device limit notifications sent: {$result['notified']}.");

        if ($result['failed'] > 0) {
            $this->error("Device limit checks failed: {$result['failed']}.");

            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}
