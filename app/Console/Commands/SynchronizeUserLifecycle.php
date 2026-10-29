<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\UserLifecycleSynchronizationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

final class SynchronizeUserLifecycle extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:synchronize-lifecycle';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronize local user lifecycle tags with Remnawave';

    /**
     * Execute the console command.
     *
     * @param UserLifecycleSynchronizationService $synchronizationService
     *
     * @return int
     */
    public function handle(UserLifecycleSynchronizationService $synchronizationService): int
    {
        try {
            $result = $synchronizationService->synchronize();
        } catch (Throwable $exception) {
            Log::error('User lifecycle synchronization aborted.', [
                'exception' => $exception::class,
                'code' => $exception->getCode(),
            ]);

            $this->error('User lifecycle synchronization aborted.');

            return self::FAILURE;
        }

        $this->info("User lifecycle states checked: {$result['checked']}.");
        $this->info("User lifecycle states changed: {$result['changed']}.");

        if ($result['failed'] > 0) {
            $this->error("User lifecycle synchronizations failed: {$result['failed']}.");

            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}
