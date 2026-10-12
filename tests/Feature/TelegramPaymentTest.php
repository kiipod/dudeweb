<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\ChatMessage;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Product;
use App\Models\Promocode;
use App\Models\TelegramBot;
use App\Models\User;
use App\Payment\Enums\PaymentSource;
use App\Payment\Enums\PaymentStatus;
use DefStudio\Telegraph\Facades\Telegraph;
use DefStudio\Telegraph\Support\Testing\Fakes\TelegraphFake;
use DefStudio\Telegraph\Telegraph as TelegraphClient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;
use YooKassa\Client;
use YooKassa\Request\Payments\CreatePaymentResponse;

final class TelegramPaymentTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return void
     */
    public function test_plans_overview_keeps_base_price_and_explains_automatic_discount(): void
    {
        $chatId = 123_400;
        $user = User::factory()->create(['chat_id' => $chatId]);
        $plan = Plan::factory()->create([
            'name' => 'Безлимитный',
            'code' => 'unlimited',
        ]);
        Product::factory()->create([
            'plan_id' => $plan->id,
            'name' => '1 месяц',
            'price' => 20_000,
        ]);
        Promocode::factory()->create([
            'user_id' => $user->id,
            'title' => 'AUTOMATIC',
            'discount_value' => 30,
            'count' => 1,
        ]);
        ChatMessage::query()->create([
            'type' => 'plans',
            'text' => 'Выберите тариф',
            'status' => 'active',
        ]);
        $bot = $this->bot($chatId);
        $fake = Telegraph::fake();

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload(
            $chatId,
            'action:plans',
        ))->assertNoContent();

        $fake->assertSent('от *200 ₽/месяц*', false);
        $fake->assertNotSent('от *140 ₽/месяц*', false);
        $fake->assertSent(
            'Промокод *AUTOMATIC* применён. Скидка будет учтена после выбора тарифа.',
            false,
        );
    }

    /**
     * @return void
     */
    public function test_automatic_promocode_hides_manual_flow_and_displays_discounted_price(): void
    {
        $chatId = 123_401;
        $user = User::factory()->create(['chat_id' => $chatId]);
        $plan = Plan::factory()->create([
            'name' => 'Безлимитный',
            'code' => 'unlimited',
        ]);
        $product = Product::factory()->create([
            'plan_id' => $plan->id,
            'name' => '1 месяц',
            'price' => 20_000,
        ]);
        $promocode = Promocode::factory()->create([
            'user_id' => $user->id,
            'title' => 'AUTOMATIC',
            'discount_value' => 30,
            'count' => 1,
        ]);
        $bot = $this->bot($chatId);
        $fake = Telegraph::fake();

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload(
            $chatId,
            'action:unlimited',
        ))->assertNoContent();

        $fake->assertSent('<s>200 ₽</s> → <b>140 ₽</b>', false);
        $fake->assertSent(
            'Промокод <b>AUTOMATIC</b> применён. Скидка: <b>30%</b>.',
            false,
        );
        $fake->assertSentData(TelegraphClient::ENDPOINT_MESSAGE, [
            'parse_mode' => TelegraphClient::PARSE_HTML,
            'reply_markup' => [
                'inline_keyboard' => [[
                    [
                        'text' => '1 месяц — 140 ₽',
                        'callback_data' => "action:buy;product:{$product->id};promocode:{$promocode->id}",
                    ],
                ]],
            ],
        ]);
    }

    /**
     * @return void
     */
    public function test_ordinary_user_keeps_manual_promocode_flow_and_full_price(): void
    {
        $chatId = 123_402;
        User::factory()->create(['chat_id' => $chatId]);
        $plan = Plan::factory()->create([
            'name' => 'Безлимитный',
            'code' => 'unlimited',
        ]);
        $product = Product::factory()->create([
            'plan_id' => $plan->id,
            'name' => '1 месяц',
            'price' => 20_000,
        ]);
        $bot = $this->bot($chatId);
        $fake = Telegraph::fake();

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload(
            $chatId,
            'action:unlimited',
        ))->assertNoContent();

        $fake->assertSent('<b>200 ₽</b>', false);
        $fake->assertSentData(TelegraphClient::ENDPOINT_MESSAGE, [
            'parse_mode' => TelegraphClient::PARSE_HTML,
            'reply_markup' => [
                'inline_keyboard' => [
                    [[
                        'text' => '🎁 У меня есть промокод',
                        'callback_data' => 'action:promocode;plan:unlimited',
                    ]],
                    [[
                        'text' => '1 месяц — 200 ₽',
                        'callback_data' => "action:buy;product:{$product->id}",
                    ]],
                ],
            ],
        ]);
    }

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
        $fake->assertSent("💳 Платёж создан.\n\nНажмите кнопку ниже, чтобы перейти к оплате.");
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
        $user = User::factory()->create(['chat_id' => $chatId]);
        $product = Product::factory()->create();
        $canceledPayment = Payment::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'source' => PaymentSource::Telegram,
            'status' => PaymentStatus::Canceled,
            'confirmation_url' => 'https://yookassa.test/canceled-confirmation',
        ]);
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

        $fake->assertSent("❌ Сейчас не удалось создать платёж.\n\nПопробуйте ещё раз позже.");
        $this->assertChooseSubscriptionButtonSent($fake);
        $fake->assertNotSent('internal credential detail');
        $fake->assertNotSent((string) $canceledPayment->confirmation_url);
    }

    public function test_retry_for_canceled_payment_creates_a_new_payment_and_confirmation_url(): void
    {
        $chatId = 777_001;
        $user = User::factory()->create(['chat_id' => $chatId]);
        $product = Product::factory()->create();
        $canceledPayment = Payment::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'source' => PaymentSource::Telegram,
            'status' => PaymentStatus::Canceled,
            'confirmation_url' => 'https://yookassa.test/canceled-confirmation',
        ]);
        $bot = $this->bot($chatId);
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')
            ->once()
            ->andReturn($this->response(
                '33d93cac-000f-5000-8000-126628f15142',
                'https://yookassa.test/retry-confirmation',
            ));
        $this->app->instance(Client::class, $client);
        $fake = Telegraph::fake();

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload(
            $chatId,
            "action:buy;product:{$product->id}",
        ))->assertNoContent();

        $retryPayment = Payment::query()->whereKeyNot($canceledPayment->id)->sole();

        self::assertSame($user->id, $retryPayment->user_id);
        self::assertSame($product->id, $retryPayment->product_id);
        self::assertSame(PaymentSource::Telegram, $retryPayment->source);
        self::assertSame(PaymentStatus::Pending, $retryPayment->status);
        self::assertSame('33d93cac-000f-5000-8000-126628f15142', $retryPayment->yookassa_payment_id);
        self::assertSame('https://yookassa.test/retry-confirmation', $retryPayment->confirmation_url);
        self::assertNotSame($canceledPayment->yookassa_payment_id, $retryPayment->yookassa_payment_id);
        self::assertNotSame($canceledPayment->confirmation_url, $retryPayment->confirmation_url);
        self::assertSame(PaymentStatus::Canceled, $canceledPayment->refresh()->status);
        $fake->assertSentData(TelegraphClient::ENDPOINT_MESSAGE, [
            'reply_markup' => [
                'inline_keyboard' => [[
                    [
                        'text' => 'Оплатить',
                        'url' => 'https://yookassa.test/retry-confirmation',
                    ],
                ]],
            ],
        ]);
    }

    public function test_retry_with_an_exhausted_promocode_fails_safely_without_reusing_old_url(): void
    {
        $chatId = 777_002;
        $user = User::factory()->create(['chat_id' => $chatId]);
        $product = Product::factory()->create();
        $promocode = Promocode::factory()->create(['count' => 0]);
        $canceledPayment = Payment::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'promocode_id' => $promocode->id,
            'source' => PaymentSource::Telegram,
            'status' => PaymentStatus::Canceled,
            'confirmation_url' => 'https://yookassa.test/canceled-confirmation',
        ]);
        $bot = $this->bot($chatId);
        $client = Mockery::mock(Client::class);
        $client->shouldNotReceive('createPayment');
        $this->app->instance(Client::class, $client);
        $fake = Telegraph::fake();

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload(
            $chatId,
            "action:buy;product:{$product->id};promocode:{$promocode->id}",
        ))->assertNoContent();

        $this->assertDatabaseCount('payments', 1);
        $fake->assertSent("❌ Сейчас не удалось создать платёж.\n\nПопробуйте ещё раз позже.");
        $this->assertChooseSubscriptionButtonSent($fake);
        $fake->assertNotSent((string) $canceledPayment->confirmation_url);
    }

    /**
     * @return void
     */
    public function test_missing_product_returns_to_subscription_selection(): void
    {
        $chatId = 777_003;
        User::factory()->create(['chat_id' => $chatId]);
        $bot = $this->bot($chatId);
        $fake = Telegraph::fake();

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload(
            $chatId,
            'action:buy;product:999999',
        ))->assertNoContent();

        $fake->assertSent('❌ Не удалось определить выбранный тариф. Попробуйте снова.');
        $this->assertChooseSubscriptionButtonSent($fake);
    }

    /**
     * @return void
     */
    public function test_missing_promocode_returns_to_subscription_selection(): void
    {
        $chatId = 777_004;
        User::factory()->create(['chat_id' => $chatId]);
        $product = Product::factory()->create();
        $bot = $this->bot($chatId);
        $fake = Telegraph::fake();

        $this->postJson("/telegraph/{$bot->token}/webhook", $this->callbackPayload(
            $chatId,
            "action:buy;product:{$product->id};promocode:999999",
        ))->assertNoContent();

        $fake->assertSent('❌ Промокод больше недоступен. Выберите тариф повторно.');
        $this->assertChooseSubscriptionButtonSent($fake);
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
     * @param TelegraphFake $fake
     * @return void
     */
    private function assertChooseSubscriptionButtonSent(TelegraphFake $fake): void
    {
        $fake->assertSentData(TelegraphClient::ENDPOINT_MESSAGE, [
            'reply_markup' => [
                'inline_keyboard' => [[[
                    'text' => 'Выбрать подписку',
                    'callback_data' => 'action:unlimited',
                ]]],
            ],
        ]);
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

    private function response(
        string $id = '23d93cac-000f-5000-8000-126628f15141',
        string $confirmationUrl = 'https://yookassa.test/confirm',
    ): CreatePaymentResponse {
        return new CreatePaymentResponse([
            'id' => $id,
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
                'confirmation_url' => $confirmationUrl,
            ],
            'paid' => false,
            'refundable' => false,
            'test' => true,
            'metadata' => [],
        ]);
    }
}
