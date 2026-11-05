<?php

declare(strict_types=1);

namespace Tests\Audit;

use App\Models\Payment;
use App\Models\Promocode;
use App\Models\User;
use App\Services\PromocodeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

final class FinalDatabaseVerificationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Checks isolated schema compatibility and only data-safe rollback round trips.
     *
     * @return void
     */
    public function test_final_schema_and_safe_rollback_preserve_test_records(): void
    {
        Http::preventStrayRequests();
        self::assertSame('testing', DB::getDatabaseName());
        $owner = User::factory()->create();
        $payment = Payment::factory()->for($owner)->create();
        $before = $payment->only(['id', 'user_id', 'amount', 'status']);
        $roundTrips = [];
        foreach (['2026_10_29_174816_add_subscription_recovery_markers_to_payments.php',
            '2026_10_29_211351_add_provider_request_recovery_to_payments.php'] as $file) {
            // The newly added columns are all null in this fixture. No recovery data is discarded.
            $migration = require database_path('migrations/' . $file);
            $migration->down();
            $migration->up();
            self::assertSame($before, $payment->refresh()->only(['id', 'user_id', 'amount', 'status']));
            self::assertNotNull($payment->product->plan);
            $roundTrips[] = $file;
        }
        $promo = Promocode::factory()->create(['count' => 2]);
        DB::transaction(fn() => app(PromocodeService::class)->markAsUsed($promo, $owner));
        $campaign = require database_path('migrations/2026_10_29_174815_allow_shared_promocode_usage.php');
        $campaign->down();
        $campaign->up();
        $this->assertDatabaseHas('user_promocodes', ['user_id' => $owner->id, 'promocode_id' => $promo->id]);
        DB::transaction(fn() => app(PromocodeService::class)->markAsUsed($promo->fresh(), User::factory()->create()));
        self::assertSame(0, $promo->fresh()->count);
        try {
            $campaign->down();
            self::fail('Shared usage cannot safely return to a globally unique campaign.');
        } catch (\RuntimeException $exception) {
            self::assertStringContainsString('Shared campaign usage', $exception->getMessage());
        }
        $this->assertDatabaseCount('user_promocodes', 2);
        $schema = [];
        foreach (['users', 'payments', 'products', 'promocodes', 'user_promocodes', 'referral_rewards',
            'support_tickets', 'support_messages', 'telegram_account_links'] as $table) {
            $schema[$table] = ['columns' => Schema::getColumnListing($table),
                'indexes' => Schema::getIndexes($table), 'foreignKeys' => Schema::getForeignKeys($table)];
        }
        self::assertTrue(array_any($schema['payments']['indexes'], fn(array $index): bool => $index['unique'] && $index['columns'] === ['idempotency_key']));
        self::assertTrue(array_any($schema['user_promocodes']['indexes'], fn(array $index): bool => !$index['unique'] && $index['columns'] === ['promocode_id']));
        self::assertNotEmpty($schema['payments']['foreignKeys']);
        foreach (['subscription_source_expires_at', 'subscription_applied_at', 'provider_request',
            'provider_request_expires_at', 'provider_creation_failed_at', 'creation_resolution'] as $column) {
            self::assertContains($column, $schema['payments']['columns']);
        }
        Http::assertNothingSent();
        file_put_contents(__DIR__ . '/final-database.json', json_encode([
            'database' => 'testing', 'driver' => DB::getDriverName(), 'safeEmptyMetadataRoundTrips' => $roundTrips,
            'campaignRoundTripPreservedUsage' => true, 'unsafeCampaignRollbackBlocked' => true,
            'recoveryDataPopulatedRollback' => 'NOT_EXECUTED: destructive, forward fix required',
            'schema' => $schema,
        ], JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR) . "\n");
    }
}
