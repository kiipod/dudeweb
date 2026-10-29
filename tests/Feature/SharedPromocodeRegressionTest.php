<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Promocode;
use App\Models\User;
use App\Services\PromocodeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

final class SharedPromocodeRegressionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Lets two eligible customers consume a shared code while keeping retries idempotent.
     *
     * @return void
     */
    public function test_shared_promocode_is_consumed_by_two_different_users(): void
    {
        $promo = Promocode::factory()->create(['count' => 2]);
        $users = User::factory()->count(2)->create();
        foreach ($users as $user) {
            DB::transaction(fn() => app(PromocodeService::class)->markAsUsed($promo->fresh(), $user));
        }
        DB::transaction(fn() => app(PromocodeService::class)->markAsUsed($promo->fresh(), $users[0]));
        self::assertSame(0, $promo->fresh()->count);
        $this->assertDatabaseCount('user_promocodes', 2);
    }


    /**
     * Unlimited campaigns support multiple customers and block destructive rollback.
     *
     * @return void
     */
    public function test_unlimited_campaign_usage_prevents_unsafe_rollback(): void
    {
        $promo = Promocode::factory()->create(['count' => null]);
        foreach (User::factory()->count(2)->create() as $user) {
            DB::transaction(fn() => app(PromocodeService::class)->markAsUsed($promo, $user));
        }
        $migration = require database_path('migrations/2026_10_29_174815_allow_shared_promocode_usage.php');
        try {
            $migration->down();
            self::fail('Shared usage must prevent rollback to one customer per code.');
        } catch (\RuntimeException $exception) {
            self::assertStringContainsString('Shared campaign usage', $exception->getMessage());
        }
        self::assertNull($promo->fresh()->count);
        $this->assertDatabaseCount('user_promocodes', 2);
    }

    /**
     * Reversible DDL preserves existing single-customer history and the campaign FK index.
     *
     * @return void
     */
    public function test_campaign_migration_round_trip_preserves_history(): void
    {
        $promo = Promocode::factory()->create(['count' => 2]);
        $user = User::factory()->create();
        DB::transaction(fn() => app(PromocodeService::class)->markAsUsed($promo, $user));
        $migration = require database_path('migrations/2026_10_29_174815_allow_shared_promocode_usage.php');
        $migration->down();
        $migration->up();
        $this->assertDatabaseHas('user_promocodes', ['user_id' => $user->id, 'promocode_id' => $promo->id]);
        DB::transaction(fn() => app(PromocodeService::class)->markAsUsed($promo->fresh(), User::factory()->create()));
        $this->assertDatabaseCount('user_promocodes', 2);
    }

}
