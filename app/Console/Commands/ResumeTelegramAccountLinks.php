<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\TelegramLinkState;
use App\Models\TelegramAccountLink;
use App\Services\Profile\TelegramAccountMerger;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

final class ResumeTelegramAccountLinks extends Command
{
    /** @var string */
    protected $signature = 'telegram-links:resume';

    /** @var string */
    protected $description = 'Resume confirmed Telegram account merges from their last durable stage';

    /**
     * Повторяет только уже начатые merges; одноразовое согласие не продлевается.
     *
     * @param TelegramAccountMerger $merger
     *
     * @return int
     */
    public function handle(TelegramAccountMerger $merger): int
    {
        $failed = 0;
        foreach (TelegramAccountLink::query()->whereIn('state', [
            TelegramLinkState::Applying, TelegramLinkState::RemoteApplied, TelegramLinkState::LocalApplied,
        ])->lazyById(100) as $link) {
            try {
                $merger->resume($link->id);
            } catch (Throwable $exception) {
                $failed++;
                Log::warning('Telegram account merge retry failed.', ['link_id' => $link->id, 'exception' => $exception::class]);
            }
        }
        $this->info("Telegram merges pending retry: {$failed}");
        return $failed === 0 ? self::SUCCESS : self::FAILURE;
    }
}
