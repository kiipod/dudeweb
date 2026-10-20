<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\Plan;
use App\Models\Product;
use App\Models\Promocode;
use App\Models\User;
use App\Payment\Enums\PaymentSource;
use App\Payment\Enums\PaymentStatus;
use App\Payment\PaymentReturnUrl;
use App\Payment\CanceledPaymentProcessor;
use Database\Factories\UserPromocodeFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;
use YooKassa\Client;
use YooKassa\Request\Payments\CreatePaymentResponse;
use YooKassa\Model\Payment\CancellationDetails;

final class AccountSubscriptionPaymentTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Запрещает реальные provider calls в Feature suite.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        Http::preventStrayRequests();
        $client = Mockery::mock(Client::class);
        $client->shouldNotReceive('createPayment');
        $this->app->instance(Client::class, $client);
    }

    /**
     * Проверяет auth и verification для новых reads/mutations.
     *
     * @return void
     */
    public function test_account_payment_routes_require_a_verified_web_session(): void
    {
        $payment = Payment::factory()->create();
        foreach (['/account/subscription', "/account/payments/{$payment->id}"] as $url) {
            $this->get($url)->assertRedirect('/login');
        }
        $this->postJson('/account/subscription/promo')->assertUnauthorized();
        $this->postJson("/account/payments/{$payment->id}/retry")->assertUnauthorized();
        $this->actingAs(User::factory()->web()->create(), 'web');
        $this->get('/account/subscription')->assertRedirect('/email/verify');
        $this->postJson('/account/subscription/promo')->assertForbidden();
        $this->postJson('/payments')->assertForbidden();
    }

    /**
     * Проверяет explicit periods, tie-breaker и отсутствие секретных полей.
     *
     * @return void
     */
    public function test_subscription_catalogue_and_history_are_owned_ordered_and_safe(): void
    {
        $user = User::factory()->web()->verified()->create();
        $plan = Plan::factory()->create(['code' => 'unlimited', 'name' => 'Реальный тариф', 'short_name' => 'Безлимитный']);
        $products = [];
        foreach ([12, 1, 6, 3] as $months) {
            $products[$months] = Product::factory()->for($plan)->create(['months' => $months, 'price' => $months * 20_000]);
        }
        Product::factory()->for($plan)->create(['months' => 1, 'price' => 999]);
        Product::factory()->for($plan)->create(['months' => null]);
        Product::factory()->for($plan)->create(['months' => 3, 'status' => 'inactive']);
        $older = Payment::factory()->for($user)->for($products[1])->create(['created_at' => now()->startOfSecond()]);
        $newer = Payment::factory()->for($user)->for($products[3])->create(['created_at' => $older->created_at]);
        Payment::factory()->create();

        $this->actingAs($user, 'web')->get('/account/subscription')->assertOk()
            ->assertHeader('Cache-Control', 'no-store, private')
            ->assertViewHas('page', fn(array $page): bool => $page['encryptHistory'] === true)
            ->assertInertia(fn(Assert $page) => $page->component('Account/Subscription')
                ->where('catalogue.plan.name', 'Безлимитный')
                ->where('catalogue.products.0.id', $products[1]->id)
                ->where('catalogue.products.0.amount', 20_000)
                ->where('catalogue.products.3.months', 12)->has('catalogue.products', 4)
                ->where('catalogue.discount', null)->where('subscription', null)
                ->where('serviceState', 'service_error')->where('payments.total', 2)
                ->where('payments.data.0.id', $newer->id)->where('payments.data.1.id', $older->id)
                ->missing('payments.data.0.confirmation_url')->missing('payments.data.0.metadata')
                ->missing('payments.data.0.idempotency_key')->missing('payments.data.0.user_id'));
        Http::assertNothingSent();
    }

    /**
     * Удалённый срок остаётся свежим provider truth без subscription URL в props.
     *
     * @return void
     */
    public function test_subscription_reads_fresh_remote_expiration_and_excludes_the_personal_url(): void
    {
        $user = User::factory()->web()->verified()->create(['remnawave_user_id' => 42]);
        config(['services.remnawave.api_url' => 'https://panel.test', 'services.remnawave.token' => 'hidden']);
        $expires = now()->utc()->addDays(18)->startOfSecond()->toIso8601String();
        Http::fake(fn($request) => Http::response(['response' => str_ends_with($request->url(), '/users/42') ? [
            'id' => 42, 'shortUuid' => 'short', 'username' => 'hidden', 'status' => 'ACTIVE', 'tag' => 'ACTIVE',
            'trafficLimitBytes' => 0, 'trafficLimitStrategy' => 'NO_RESET', 'expireAt' => $expires,
            'hwidDeviceLimit' => 5, 'createdAt' => now()->toIso8601String(), 'updatedAt' => now()->toIso8601String(),
            'trojanPassword' => 'hidden', 'vlessUuid' => 'hidden', 'ssPassword' => 'hidden',
            'subscriptionUrl' => 'https://sub.example.test/secret',
            'activeInternalSquads' => [], 'lastTriggeredThreshold' => 0,
            'userTraffic' => ['usedTrafficBytes' => 0, 'lifetimeUsedTrafficBytes' => 0],
        ] : ['total' => 0, 'devices' => []]]));
        $this->actingAs($user, 'web')->get('/account/subscription')->assertOk()->assertInertia(
            fn(Assert $page) => $page->where('serviceState', 'ready')->where('subscription.expiresAt', $expires)->missing('subscription.url'),
        );
    }

    /**
     * Отсутствующие периоды не получают выдуманный product ID или цену.
     *
     * @return void
     */
    public function test_empty_catalogue_and_history_remain_empty(): void
    {
        $this->actingAs(User::factory()->web()->verified()->create(), 'web')->get('/account/subscription')
            ->assertOk()->assertInertia(fn(Assert $page) => $page->where('catalogue.plan', null)->has('catalogue.products', 0)->has('payments.data', 0));
    }

    /**
     * Preview возвращает финальные суммы для всех реальных периодов без расходования.
     *
     * @return void
     */
    public function test_promo_preview_and_removal_use_server_prices(): void
    {
        $user = User::factory()->web()->verified()->create();
        $plan = Plan::factory()->create(['code' => 'unlimited']);
        Product::factory()->for($plan)->create(['months' => 1, 'price' => 20_000]);
        Product::factory()->for($plan)->create(['months' => 3, 'price' => 54_000]);
        $promo = Promocode::factory()->create(['title' => 'Dude', 'type' => 'percent', 'discount_value' => 30]);
        $this->actingAs($user, 'web')->postJson('/account/subscription/promo', ['promocode' => ' dude '])
            ->assertOk()->assertJsonPath('discount.code', 'Dude')->assertJsonPath('discount.automatic', false)
            ->assertJsonPath('products.0.originalAmount', 20_000)->assertJsonPath('products.0.amount', 14_000)
            ->assertJsonPath('products.1.amount', 37_800);
        $this->postJson('/account/subscription/promo', ['promocode' => null])->assertOk()->assertJsonPath('discount', null)->assertJsonPath('products.0.amount', 20_000);
        self::assertSame($promo->count, $promo->fresh()->count);
        $this->assertDatabaseCount('user_promocodes', 0);
        $this->assertDatabaseCount('payments', 0);
    }

    /**
     * Перечисляет недоступные состояния промокодов.
     *
     * @return array<string, array{string}>
     */
    public static function promoCases(): array
    {
        return ['missing' => ['missing'], 'exhausted' => ['exhausted'], 'used' => ['used'], 'automatic' => ['automatic'], 'foreign' => ['foreign']];
    }

    /**
     * Не допускает недоступный промокод и сложение автоматической/ручной скидки.
     *
     * @param string $scenario
     *
     * @return void
     */
    #[DataProvider('promoCases')]
    public function test_promo_errors_are_bound_to_the_field(string $scenario): void
    {
        $user = User::factory()->web()->verified()->create();
        $promo = Promocode::factory()->create(['title' => 'manual', 'count' => $scenario === 'exhausted' ? 0 : 2, 'user_id' => $scenario === 'foreign' ? User::factory()->create()->id : null]);
        if ($scenario === 'used') {
            UserPromocodeFactory::new()->create(['user_id' => $user->id, 'promocode_id' => $promo->id]);
        }
        if ($scenario === 'automatic') {
            Promocode::factory()->create(['user_id' => $user->id, 'count' => 1]);
        }
        $this->actingAs($user, 'web')->postJson('/account/subscription/promo', ['promocode' => $scenario === 'missing' ? 'unknown' : 'manual'])
            ->assertUnprocessable()->assertJsonValidationErrors('promocode');
    }

    /**
     * Payment creation заново проверяет eligibility после успешного preview.
     *
     * @return void
     */
    public function test_payment_revalidates_preview_and_product_eligibility(): void
    {
        $user = User::factory()->web()->verified()->create();
        $product = Product::factory()->create();
        $promo = Promocode::factory()->create(['title' => 'once', 'count' => 1]);
        $this->actingAs($user, 'web')->postJson('/account/subscription/promo', ['promocode' => 'once'])->assertOk();
        $promo->update(['count' => 0]);
        $this->postJson('/payments', ['product_id' => $product->id, 'promocode' => 'once'])->assertUnprocessable()->assertJsonValidationErrors('promocode');
        foreach ([['months' => null], ['months' => 2], ['price' => 0]] as $attributes) {
            $unavailable = Product::factory()->create($attributes);
            $this->postJson('/payments', ['product_id' => $unavailable->id])->assertUnprocessable()->assertJsonValidationErrors('product_id');
        }
        $product->plan->forceFill(['status' => 'inactive'])->save();
        $this->postJson('/payments', ['product_id' => $product->id])->assertUnprocessable()->assertJsonValidationErrors('product_id');
        $this->assertDatabaseCount('payments', 0);
    }

    /**
     * Успешный повтор intent после расходования кода не создаёт второй платёж.
     *
     * @return void
     */
    public function test_payment_idempotency_survives_terminal_status_and_consumed_promo(): void
    {
        $user = User::factory()->web()->verified()->create();
        $product = Product::factory()->create(['name' => 'Год доступа', 'months' => 12]);
        $promo = Promocode::factory()->create(['title' => 'once', 'discount_value' => 30]);
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')->once()->andReturn($this->providerResponse());
        $this->app->instance(Client::class, $client);
        $this->actingAs($user, 'web')->withHeader('Idempotency-Key', 'one-action');
        $first = $this->postJson('/payments', ['product_id' => $product->id, 'promocode' => 'once'])->assertCreated();
        $payment = Payment::findOrFail($first->json('payment_id'));
        self::assertSame(12, $payment->months);
        $payment->update(['status' => PaymentStatus::Succeeded, 'processed_at' => now()]);
        UserPromocodeFactory::new()->create(['user_id' => $user->id, 'promocode_id' => $promo->id]);
        $this->postJson('/payments', ['product_id' => $product->id, 'promocode' => 'once'])->assertCreated()->assertExactJson($first->json());
        $this->assertDatabaseCount('payments', 1);
        $this->flushSession();
        $this->actingAs(User::factory()->web()->verified()->create(), 'web')
            ->postJson('/payments', ['product_id' => $product->id, 'promocode' => 'once'])->assertUnprocessable()->assertJsonMissing(['confirmation_url' => $payment->confirmation_url]);
        $this->withHeader('Idempotency-Key', str_repeat('x', 65))->postJson('/payments', ['product_id' => $product->id])->assertUnprocessable();
    }

    /**
     * Перечисляет состояния local payment, включая незавершённый success processing.
     *
     * @return array<string, array{PaymentStatus, bool, string}>
     */
    public static function paymentStates(): array
    {
        return [
            'pending' => [PaymentStatus::Pending, false, 'pending'],
            'success' => [PaymentStatus::Succeeded, true, 'succeeded'],
            'unprocessed success' => [PaymentStatus::Succeeded, false, 'pending'],
            'failure' => [PaymentStatus::Canceled, false, 'canceled'],
        ];
    }

    /**
     * Проверяет local truth, ownership и безопасный status partial reload.
     *
     * @param PaymentStatus $status
     * @param bool $processed
     * @param string $expected
     *
     * @return void
     */
    #[DataProvider('paymentStates')]
    public function test_payment_status_is_local_owned_and_private(PaymentStatus $status, bool $processed, string $expected): void
    {
        $user = User::factory()->web()->verified()->create();
        $payment = Payment::factory()->for($user)->create(['status' => $status, 'processed_at' => $processed ? now() : null]);
        $response = $this->actingAs($user, 'web')->get("/account/payments/{$payment->id}")->assertOk()
            ->assertHeader('Cache-Control', 'no-store, private')
            ->assertInertia(fn(Assert $page) => $page->component('Account/Payments/Show')->where('payment.status', $expected)->missing('payment.confirmation_url')->missing('payment.metadata'));
        $version = $response->viewData('page')['version'];
        $this->get("/account/payments/{$payment->id}", ['X-Inertia' => 'true', 'X-Inertia-Version' => $version, 'X-Inertia-Partial-Component' => 'Account/Payments/Show', 'X-Inertia-Partial-Data' => 'payment'])
            ->assertOk()->assertJsonPath('props.payment.status', $expected);
        $this->flushSession();
        $this->actingAs(User::factory()->web()->verified()->create(), 'web')->get("/account/payments/{$payment->id}")->assertForbidden();
        $url = app(PaymentReturnUrl::class)->generate($payment, 'http://localhost/payments/return');
        $this->get($url)->assertRedirect(route('account.payments.show', $payment));
        Http::assertNothingSent();
    }

    /**
     * Повторный double submit возвращает одну новую попытку с новым URL и ключом.
     *
     * @return void
     */
    public function test_retry_creates_a_new_attempt_and_rejects_other_statuses_and_owners(): void
    {
        $user = User::factory()->web()->verified()->create();
        $original = Payment::factory()->for($user)->create(['status' => PaymentStatus::Canceled, 'confirmation_url' => 'https://old.test/never-reuse']);
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')->once()->withArgs(fn(array $payload, string $key): bool => $key === 'retry-action')->andReturn($this->providerResponse());
        $this->app->instance(Client::class, $client);
        $this->actingAs($user, 'web')->withHeader('Idempotency-Key', 'retry-action');
        $first = $this->postJson("/account/payments/{$original->id}/retry")->assertCreated()->assertJsonPath('confirmation_url', 'https://yookassa.test/new-attempt');
        $this->postJson("/account/payments/{$original->id}/retry")->assertCreated()->assertExactJson($first->json());
        self::assertNotSame($original->id, $first->json('payment_id'));
        self::assertSame(PaymentStatus::Canceled, $original->fresh()->status);
        $this->assertDatabaseCount('payments', 2);
        $this->withHeader('Idempotency-Key', $original->idempotency_key)->postJson("/account/payments/{$original->id}/retry")->assertUnprocessable();
        foreach ([PaymentStatus::Pending, PaymentStatus::Succeeded] as $status) {
            $payment = Payment::factory()->for($user)->create(['status' => $status]);
            $this->postJson("/account/payments/{$payment->id}/retry")->assertForbidden();
        }
        $telegram = Payment::factory()->for($user)->create(['status' => PaymentStatus::Canceled, 'source' => PaymentSource::Telegram]);
        $this->postJson("/account/payments/{$telegram->id}/retry")->assertForbidden();
        $this->flushSession();
        $this->actingAs(User::factory()->web()->verified()->create(), 'web')->postJson("/account/payments/{$original->id}/retry")->assertForbidden();
    }

    /**
     * Нельзя повторить покупку удалённого продукта или исчерпанного промокода.
     *
     * @return void
     */
    public function test_retry_revalidates_product_and_promocode(): void
    {
        $user = User::factory()->web()->verified()->create();
        $promo = Promocode::factory()->create(['count' => 0]);
        $payment = Payment::factory()->for($user)->create(['status' => PaymentStatus::Canceled, 'promocode_id' => $promo->id]);
        $this->actingAs($user, 'web')->withHeader('Idempotency-Key', 'new-retry');
        $this->postJson("/account/payments/{$payment->id}/retry")->assertUnprocessable()->assertJsonValidationErrors('promocode');
        $payment->update(['product_id' => null]);
        $this->postJson("/account/payments/{$payment->id}/retry")->assertUnprocessable()->assertJsonValidationErrors('product_id');
        $this->assertDatabaseCount('payments', 1);
    }

    /**
     * Строит SDK response без реального provider создания.
     *
     * @param string $amount
     *
     * @return CreatePaymentResponse
     */
    private function providerResponse(string $amount = '140.00'): CreatePaymentResponse
    {
        return new CreatePaymentResponse([
            'id' => '23d93cac-000f-5000-8000-126628f15141', 'status' => 'pending',
            'recipient' => ['account_id' => '123', 'gateway_id' => '456'],
            'amount' => ['value' => $amount, 'currency' => 'RUB'], 'created_at' => '2026-10-20T12:00:00.000Z',
            'confirmation' => ['type' => 'redirect', 'confirmation_url' => 'https://yookassa.test/new-attempt'],
            'paid' => false, 'refundable' => false, 'test' => true,
        ]);
    }

    /**
     * Перечисляет разрешённые явные периоды независимо от name.
     *
     * @return array<string, array{int}>
     */
    public static function periods(): array
    {
        return ['one' => [1], 'three' => [3], 'six' => [6], 'twelve' => [12]];
    }

    /**
     * Каждый real period создаётся по months и отклоняется после отключения.
     *
     * @param int $months
     *
     * @return void
     */
    #[DataProvider('periods')]
    public function test_each_explicit_period_is_purchasable_only_while_active(int $months): void
    {
        $user = User::factory()->web()->verified()->create();
        $product = Product::factory()->create(['name' => 'Продление доступа', 'months' => $months]);
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')->once()->andReturn($this->providerResponse('200.00'));
        $this->app->instance(Client::class, $client);
        $response = $this->actingAs($user, 'web')->postJson('/payments', ['product_id' => $product->id])->assertCreated();
        $this->assertDatabaseHas('payments', ['id' => $response->json('payment_id'), 'months' => $months, 'amount' => 20_000]);
        $product->update(['status' => 'inactive']);
        $this->postJson('/payments', ['product_id' => $product->id])->assertUnprocessable()->assertJsonValidationErrors('product_id');
        $this->assertDatabaseCount('payments', 1);
    }

    /**
     * Web UI сохраняет запрет retry merchant cancellation без повторных side effects.
     *
     * @return void
     */
    public function test_merchant_cancellation_is_recorded_once_and_cannot_be_retried(): void
    {
        $user = User::factory()->web()->verified()->create();
        $payment = Payment::factory()->for($user)->create();
        $details = new CancellationDetails(['party' => 'merchant', 'reason' => 'canceled_by_merchant']);
        app(CanceledPaymentProcessor::class)->process($payment->id, $details);
        app(CanceledPaymentProcessor::class)->process($payment->id, null);
        self::assertSame('canceled_by_merchant', data_get($payment->fresh()->metadata, 'cancellation_details.reason'));
        $this->actingAs($user, 'web')->get("/account/payments/{$payment->id}")->assertOk()
            ->assertInertia(fn(Assert $page) => $page->where('payment.status', 'canceled')->where('payment.retryUrl', null)->missing('payment.metadata'));
        $this->withHeader('Idempotency-Key', 'merchant-retry')->postJson("/account/payments/{$payment->id}/retry")->assertForbidden();
        $this->assertDatabaseCount('payments', 1);
        Http::assertNothingSent();
    }
}
