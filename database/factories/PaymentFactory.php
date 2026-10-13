<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use App\Payment\Enums\PaymentSource;
use App\Payment\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;
use Illuminate\Support\Str;

/** @extends Factory<Payment> */
#[UseModel(Payment::class)]
final class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'product_id' => Product::factory(),
            'promocode_id' => null,
            'yookassa_payment_id' => (string) Str::uuid(),
            'idempotency_key' => (string) Str::uuid(),
            'source' => PaymentSource::Web,
            'months' => 1,
            'original_amount' => 20_000,
            'confirmation_url' => 'https://yookassa.test/confirm',
            'status' => PaymentStatus::Pending,
            'amount' => 20_000,
            'currency' => 'RUB',
            'description' => 'Тестовый платёж',
            'metadata' => [],
            'refundable' => false,
            'test' => true,
        ];
    }
}
