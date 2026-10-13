<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\SubscriptionExpirationReminderService;
use Illuminate\Console\Command;
use Throwable;

final class NotifyExpiringSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:notify-expiring';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Notify Telegram users whose subscriptions expire within one day';

    /**
     * Execute the console command.
     *
     * @param SubscriptionExpirationReminderService $reminderService
     * @return int
     * @throws Throwable
     */
    public function handle(SubscriptionExpirationReminderService $reminderService): int
    {
        $result = $reminderService->sendDue();

        $this->info("Subscription reminders sent: {$result['sent']}.");

        if ($result['failed'] > 0) {
            $this->error("Subscription reminders failed: {$result['failed']}.");

            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}
