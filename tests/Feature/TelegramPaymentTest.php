<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Product;
use App\Models\TelegramBot;
use App\Models\User;
use DefStudio\Telegraph\Facades\Telegraph;
use DefStudio\Telegraph\Telegraph as TelegraphClient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;
use YooKassa\Client;
use YooKassa\Request\Payments\CreatePaymentResponse;

final class TelegramPaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_buy_callback_creates_telegram_payment_and_sends_payment_button(): void
    {
        $chatId = 123_456;
        $user = User::factory()->create(['chat_id' => $chatId]);
        $product = Product::factory()->create();
        $bot = $this->bot($chatId);
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')
            ->once()
            ->withArgs(static fn(array $payload): bool => $payload['metadata']['source'] === 'telegram')
            ->andReturn($this->response());
        $this->app->instance(Client::class, $client);
        $fake = Telegraph::fake();

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload(
            $chatId,
            "action:buy;product:{$product->id}",
        ))->assertNoContent();

        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'product_id' => $product->id,
            'source' => 'telegram',
            'status' => 'pending',
            'confirmation_url' => 'https://yookassa.test/confirm',
        ]);
        $fake->assertSent('Платёж создан. Нажмите кнопку ниже, чтобы перейти к оплате.');
        $fake->assertSentData(TelegraphClient::ENDPOINT_MESSAGE, [
            'reply_markup' => [
                'inline_keyboard' => [[
                    [
                        'text' => 'Оплатить',
                        'url' => 'https://yookassa.test/confirm',
                    ],
                ]],
            ],
        ]);
    }

    public function test_yookassa_error_is_hidden_from_telegram_user(): void
    {
        $chatId = 654_321;
        User::factory()->create(['chat_id' => $chatId]);
        $product = Product::factory()->create();
        $bot = $this->bot($chatId);
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')
            ->once()
            ->andThrow(new \RuntimeException('internal credential detail'));
        $this->app->instance(Client::class, $client);
        $fake = Telegraph::fake();

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload(
            $chatId,
            "action:buy;product:{$product->id}",
        ))->assertNoContent();

        $fake->assertSent('❌ Сейчас не удалось создать платёж. Попробуйте ещё раз позже.');
        $fake->assertNotSent('internal credential detail');
    }

    private function bot(int $chatId): TelegramBot
    {
        $bot = TelegramBot::query()->create([
            'token' => 'test-bot-token-' . $chatId,
            'name' => 'Test bot',
        ]);
        $bot->chats()->create([
            'chat_id' => $chatId,
            'name' => 'Test chat',
        ]);

        return $bot;
    }

    /**
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

    private function response(): CreatePaymentResponse
    {
        return new CreatePaymentResponse([
            'id' => '23d93cac-000f-5000-8000-126628f15141',
            'status' => 'pending',
            'recipient' => [
                'account_id' => '123',
                'gateway_id' => '456',
            ],
            'amount' => [
                'value' => '200.00',
                'currency' => 'RUB',
            ],
            'created_at' => '2026-10-04T12:00:00.000Z',
            'confirmation' => [
                'type' => 'redirect',
                'return_url' => 'http://localhost/payments/return',
                'confirmation_url' => 'https://yookassa.test/confirm',
            ],
            'paid' => false,
            'refundable' => false,
            'test' => true,
            'metadata' => [],
        ]);
    }
}
