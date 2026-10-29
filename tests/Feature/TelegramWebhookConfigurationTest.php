<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\TelegramBot;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class TelegramWebhookConfigurationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Uses the same configured secret for default registration and inbound verification.
     *
     * @return void
     */
    public function test_default_telegram_registration_contains_the_verification_secret(): void
    {
        config(['telegraph.webhook.secret_token' => 'synthetic-proof', 'telegraph.webhook.domain' => 'https://audit.example.test']);
        $bot = TelegramBot::factory()->create(['token' => 'synthetic-bot-token']);
        self::assertSame('synthetic-proof', $bot->registerWebhook()->toArray()['payload']['secret_token']);
    }


}
