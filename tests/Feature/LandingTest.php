<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\Product;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use PDOException;
use Tests\TestCase;

final class LandingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return void
     */
    public function test_landing_is_public_and_renders_an_honest_empty_price_state(): void
    {
        $this->get(route('home'))->assertOk()->assertInertia(fn(Assert $page) => $page
            ->component('Public/Home')->where('pricingState', 'empty')->has('plans', 0)
            ->missing('platforms')->missing('subscriptionUrl'));
    }

    /**
     * @return void
     */
    public function test_landing_uses_active_server_prices_and_explicit_periods_without_parsing_names(): void
    {
        $plan = Plan::factory()->create(['code' => 'unlimited', 'device_limit' => 7]);
        Product::factory()->for($plan)->create(['name' => 'Годовой доступ', 'months' => 12, 'price' => 190_099]);
        $monthly = Product::factory()->for($plan)->create(['name' => 'Обычный доступ', 'months' => 1, 'price' => 20_123]);
        Product::factory()->for($plan)->create(['months' => 3, 'status' => 'inactive']);
        Product::factory()->for($plan)->create(['months' => null]);
        Product::factory()->for($plan)->create(['months' => 2]);
        Product::factory()->for($plan)->create(['months' => 6, 'price' => 0]);

        $this->get(route('home'))->assertOk()->assertInertia(fn(Assert $page) => $page
            ->where('pricingState', 'ready')->has('plans', 1)
            ->where('plans.0.deviceLimit', 7)->has('plans.0.products', 2)
            ->where('plans.0.products.0.id', $monthly->id)
            ->where('plans.0.products.0.months', 1)
            ->where('plans.0.products.0.priceMinor', 20_123)
            ->where('plans.0.products.0.currency', 'RUB')
            ->where('plans.0.products.1.months', 12));
    }

    /**
     * @return void
     */
    public function test_inactive_and_other_plans_are_not_published(): void
    {
        $inactive = Plan::factory()->create(['code' => 'unlimited']);
        $inactive->forceFill(['status' => 'inactive'])->save();
        Product::factory()->for($inactive)->create();
        Product::factory()->create();

        $this->get(route('home'))->assertOk()->assertInertia(fn(Assert $page) => $page
            ->where('pricingState', 'empty')->has('plans', 0));
    }

    /**
     * @return void
     */
    public function test_landing_does_not_expose_application_catalogue_or_connection_instructions(): void
    {
        $response = $this->get(route('home'))->assertOk();
        $response->assertInertia(fn(Assert $page) => $page
            ->component('Public/Home')
            ->missing('platforms')->missing('apps')->missing('subscriptionUrl'));
        $response->assertDontSee('SUBSCRIPTION_LINK')->assertDontSee('incy://')
            ->assertDontSee('platform-instructions')->assertDontSee('incy-windows-setup.exe');
    }

    /**
     * @return void
     */
    public function test_database_failure_returns_an_unavailable_price_state_and_keeps_the_landing_available(): void
    {
        $failOnce = true;
        DB::connection()->beforeExecuting(function (string $query, array $bindings) use (&$failOnce): void {
            if ($failOnce && str_contains($query, '"plans"')) {
                $failOnce = false;
                throw new QueryException('pgsql', $query, $bindings, new PDOException('Simulated query failure'));
            }
        });

        $this->get(route('home'))->assertOk()->assertInertia(fn(Assert $page) => $page
            ->where('pricingState', 'unavailable')->has('plans', 0)->missing('platforms'));
    }
}
