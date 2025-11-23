<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\TelegramBot;
use Illuminate\Console\Command;

class RegisterBotCommands extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bot:register-commands';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Register bot commands with Telegram';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $bot = TelegramBot::first();

        if (!$bot) {
            $this->error('TelegramBot not found!');
            return;
        }

        try {
            $bot->registerBotCommands();
            $this->info('TelegramBot commands registered successfully!');
        } catch (\Exception $e) {
            $this->error('Error registering commands: ' . $e->getMessage());
        }
    }

    /**
     * @param string $signature
     * @return $this
     */
    public function setSignature(string $signature): RegisterBotCommands
    {
        $this->signature = $signature;
        return $this;
    }
}
