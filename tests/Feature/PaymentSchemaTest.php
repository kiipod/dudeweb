<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

final class PaymentSchemaTest extends TestCase
{
    use RefreshDatabase;

    public function test_payments_has_indexes_for_webhook_idempotency_and_referral_lookup(): void
    {
        $indexes = collect(Schema::getIndexes('payments'));

        self::assertTrue($indexes->contains(
            static fn(array $index): bool => $index['unique']
                && $index['columns'] === ['yookassa_payment_id'],
        ));
        self::assertTrue($indexes->contains(
            static fn(array $index): bool => $index['unique']
                && $index['columns'] === ['idempotency_key'],
        ));
        self::assertTrue($indexes->contains(
            static fn(array $index): bool => !$index['unique']
                && $index['columns'] === ['user_id', 'status'],
        ));
    }
}
