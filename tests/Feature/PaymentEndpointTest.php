<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Promocode;
use App\Models\User;
use App\Models\UserPromocode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;
use YooKassa\Client;
use YooKassa\Request\Payments\CreatePaymentResponse;

final class PaymentEndpointTest extends TestCase
{
    use RefreshDatabase;

    /** @return void */
    public function test_unauthenticated_user_cannot_create_a_payment(): void
    {
        $this->postJson('/payments', ['product_id' => 1])
            ->assertUnauthorized();
    }

    /** @return void */
    public function test_invalid_product_is_rejected(): void
    {
        $user = User::factory()->web()->verified()->create();

        $this->actingAs($user, 'web')
            ->postJson('/payments', ['product_id' => 999_999])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('product_id');
    }

    /** @return void */
    public function test_authenticated_user_can_create_a_payment(): void
    {
        $user = User::factory()->web()->verified()->create();
        $product = Product::factory()->create();
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')
            ->once()
            ->withArgs(static fn(array $payload, string $key): bool => $payload['metadata']['source'] === 'web'
                && $key === 'api-logical-request')
            ->andReturn($this->response());
        $this->app->instance(Client::class, $client);

        $response = $this->actingAs($user, 'web')
            ->withHeader('Idempotency-Key', 'api-logical-request')
            ->postJson('/payments', ['product_id' => $product->id]);

        $response->assertCreated()
            ->assertJsonStructure(['payment_id', 'confirmation_url'])
            ->assertJsonPath('confirmation_url', 'https://yookassa.test/confirm');
        $this->assertDatabaseHas('payments', [
            'id' => $response->json('payment_id'),
            'user_id' => $user->id,
            'product_id' => $product->id,
            'status' => 'pending',
            'source' => 'web',
        ]);
    }

    /** @return void */
    public function test_invalid_promocode_uses_the_existing_validation_logic(): void
    {
        $user = User::factory()->web()->verified()->create();
        $product = Product::factory()->create();
        Promocode::factory()->create(['title' => 'valid-code']);

        $this->actingAs($user, 'web')
            ->postJson('/payments', [
                'product_id' => $product->id,
                'promocode' => 'missing-code',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('promocode');

        $this->assertDatabaseCount('payments', 0);
    }

    /** @return void */
    public function test_exhausted_promocode_is_rejected(): void
    {
        $user = User::factory()->web()->verified()->create();
        $product = Product::factory()->create();
        $promocode = Promocode::factory()->create(['count' => 0]);

        $this->actingAs($user, 'web')
            ->postJson('/payments', [
                'product_id' => $product->id,
                'promocode' => $promocode->title,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('promocode');

        $this->assertDatabaseCount('payments', 0);
    }

    /** @return void */
    public function test_already_used_promocode_is_rejected(): void
    {
        $user = User::factory()->web()->verified()->create();
        $product = Product::factory()->create();
        $usedPromocode = Promocode::factory()->create();
        $promocode = Promocode::factory()->create();
        UserPromocode::query()->create([
            'user_id' => $user->id,
            'promocode_id' => $usedPromocode->id,
        ]);

        $this->actingAs($user, 'web')
            ->postJson('/payments', [
                'product_id' => $product->id,
                'promocode' => $promocode->title,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('promocode');

        $this->assertDatabaseCount('payments', 0);
    }

    /**
     * @return void
     */
    public function test_manual_promocode_cannot_replace_automatic_promocode(): void
    {
        $user = User::factory()->web()->verified()->create();
        $product = Product::factory()->create();
        Promocode::factory()->create([
            'user_id' => $user->id,
            'count' => 1,
        ]);
        $manualPromocode = Promocode::factory()->create();
        $client = Mockery::mock(Client::class);
        $client->shouldNotReceive('createPayment');
        $this->app->instance(Client::class, $client);

        $this->actingAs($user, 'web')
            ->postJson('/payments', [
                'product_id' => $product->id,
                'promocode' => $manualPromocode->title,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('promocode');

        $this->assertDatabaseCount('payments', 0);
        $this->assertDatabaseCount('user_promocodes', 0);
    }

    /**
     * @return void
     */
    public function test_personal_promocode_cannot_be_used_by_another_user(): void
    {
        $owner = User::factory()->web()->verified()->create();
        $user = User::factory()->web()->verified()->create();
        $product = Product::factory()->create();
        $personalPromocode = Promocode::factory()->create([
            'user_id' => $owner->id,
            'count' => 1,
        ]);

        $this->actingAs($user, 'web')
            ->postJson('/payments', [
                'product_id' => $product->id,
                'promocode' => $personalPromocode->title,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('promocode');

        $this->assertDatabaseCount('payments', 0);
        $this->assertDatabaseCount('user_promocodes', 0);
    }

    /** @return void */
    public function test_yookassa_error_returns_a_safe_gateway_response(): void
    {
        $user = User::factory()->web()->verified()->create();
        $product = Product::factory()->create();
        $client = Mockery::mock(Client::class);
        $client->shouldReceive('createPayment')
            ->once()
            ->andThrow(new \RuntimeException('provider failure'));
        $this->app->instance(Client::class, $client);

        $this->actingAs($user, 'web')
            ->postJson('/payments', ['product_id' => $product->id])
            ->assertStatus(502)
            ->assertExactJson([
                'message' => 'Не удалось создать платёж. Попробуйте позже.',
            ]);
    }

    /** @return CreatePaymentResponse */
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
