<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * @return array|mixed[]
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(['pending', 'succeeded', 'canceled', 'waiting_for_capture']);

        return [
            'id' => Str::uuid(),
            'order_id' => Order::factory(),
            'confirmation_url' => $status === 'pending' ? $this->faker->url() : null,
            'status' => $status,
            'amount' => $this->faker->numberBetween(1000, 50000),
            'currency' => $this->faker->randomElement(['USD', 'EUR', 'RUB']),
            'description' => $this->faker->sentence(),
            'metadata' => [
                'source' => 'telegram_bot',
                'user_agent' => $this->faker->userAgent(),
            ],
            'recipient_account_id' => $this->faker->randomNumber(6),
            'recipient_gateway_id' => $this->faker->randomNumber(4),
            'refundable' => $this->faker->boolean(80),
            'test' => $this->faker->boolean(30),
        ];
    }

    /**
     * @param Order $order
     * @return $this
     */
    public function forOrder(Order $order): static
    {
        return $this->state(fn(array $attributes) => [
            'order_id' => $order->id,
            'amount' => $order->amount,
            'currency' => $order->currency,
        ]);
    }

    /**
     * @return $this
     */
    public function pending(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'pending',
            'confirmation_url' => $this->faker->url(),
        ]);
    }

    /**
     * @return $this
     */
    public function succeeded(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'succeeded',
            'confirmation_url' => null,
        ]);
    }

    /**
     * @return $this
     */
    public function canceled(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'canceled',
            'confirmation_url' => null,
        ]);
    }

    /**
     * @return $this
     */
    public function test(): static
    {
        return $this->state(fn(array $attributes) => [
            'test' => true,
        ]);
    }

    /**
     * @return $this
     */
    public function real(): static
    {
        return $this->state(fn(array $attributes) => [
            'test' => false,
        ]);
    }
}
