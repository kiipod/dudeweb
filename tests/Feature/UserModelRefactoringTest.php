<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\TelegramBot;
use App\Models\User;
use DefStudio\Telegraph\Facades\Telegraph;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

final class UserModelRefactoringTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return void
     */
    public function test_only_proven_duplicate_state_columns_are_removed(): void
    {
        self::assertFalse(Schema::hasColumn('users', 'is_trial'));
        self::assertFalse(Schema::hasColumn('users', 'status'));
        self::assertTrue(Schema::hasColumn('users', 'trial_expired'));
        self::assertTrue(Schema::hasColumn('users', 'is_free'));

        $user = User::factory()->create([
            'trial_expired' => '2026-10-31 12:00:00',
            'is_free' => true,
        ]);

        self::assertSame('2026-10-31 12:00:00', $user->trial_expired?->format('Y-m-d H:i:s'));
        self::assertTrue($user->is_free);
    }

    /**
     * @return void
     */
    public function test_referral_statistics_uses_local_business_tag(): void
    {
        $user = User::factory()->create();
        $referral = User::factory()->create([
            'referrer_user_id' => $user->id,
            'tags' => UserTags::Inactive,
        ]);
        $bot = $this->bot($user);
        $telegraph = Telegraph::fake();

        $this->postJson(
            "/telegraph/{$bot->token}/webhook",
            $this->callbackPayload($user->chat_id, 'action:advanced'),
        )->assertNoContent();

        $telegraph->assertSent("@{$referral->username} — Неактивен", false);
    }

    /**
     * @param User $user
     * @return TelegramBot
     */
    private function bot(User $user): TelegramBot
    {
        $bot = TelegramBot::query()->create([
            'token' => 'test-bot-token-' . $user->id,
            'name' => 'Test bot',
        ]);
        $bot->chats()->create([
            'chat_id' => $user->chat_id,
            'name' => 'Test chat',
        ]);

        return $bot;
    }

    /**
     * @param int $chatId
     * @param string $data
     * @return array<string, mixed>
     */
    private function callbackPayload(int $chatId, string $data): array
    {
        return [
            'update_id' => 1,
            'callback_query' => [
                'id' => 77,
                'from' => [
                    'id' => $chatId,
                    'is_bot' => false,
                    'first_name' => 'Test',
                ],
                'message' => [
                    'message_id' => 10,
                    'date' => now()->timestamp,
                    'chat' => [
                        'id' => $chatId,
                        'type' => 'private',
                    ],
                ],
                'data' => $data,
            ],
        ];
    }
}
