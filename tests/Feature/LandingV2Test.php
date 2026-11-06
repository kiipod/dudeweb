<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use PDOException;
use Tests\TestCase;

final class LandingV2Test extends TestCase
{
    use RefreshDatabase;

    /**
     * Verify that guests can open the separate V2 page at its named route.
     *
     * @return void
     */
    public function test_guests_can_open_the_separate_v2_page(): void
    {
        $this->assertSame('/landing', route('landing', absolute: false));

        $this->get(route('landing'))
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page->component('Public/LandingV2'));
    }

    /**
     * Verify that an authenticated web user can also open the public V2 page.
     *
     * @return void
     */
    public function test_authenticated_users_can_open_the_v2_page(): void
    {
        $this->actingAs(User::factory()->create(), 'web')
            ->get(route('landing'))
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page->component('Public/LandingV2'));
    }

    /**
     * Verify that the new public route supports HEAD without a redirect.
     *
     * @return void
     */
    public function test_the_v2_page_supports_head_requests(): void
    {
        $this->head(route('landing'))->assertOk();
    }

    /**
     * Verify that the Hero trial destination keeps existing guest registration behavior.
     *
     * @return void
     */
    public function test_the_trial_destination_opens_registration_for_guests(): void
    {
        $this->get(route('register'))
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page->component('Auth/Register'));
    }

    /**
     * Verify that existing users reach their account through the Hero trial destination.
     *
     * @return void
     */
    public function test_the_trial_destination_redirects_authenticated_users_to_their_account(): void
    {
        $this->actingAs(User::factory()->create(), 'web')
            ->get(route('register'))
            ->assertRedirectToRoute('account.dashboard');
    }

    /**
     * Publish the existing safe public pricing contract on V2 without changing home.
     *
     * @return void
     */
    public function test_v2_reuses_public_prices_and_filters_without_exposing_account_data(): void
    {
        $plan = Plan::factory()->create(['code' => 'unlimited', 'device_limit' => 7]);
        $monthly = Product::factory()->for($plan)->create(['months' => 1, 'price' => 20_123]);
        Product::factory()->for($plan)->create(['months' => 12, 'price' => 190_099]);
        Product::factory()->for($plan)->create(['months' => 3, 'status' => 'inactive']);
        Product::factory()->for($plan)->create(['months' => 6, 'price' => 0]);
        Product::factory()->for($plan)->create(['months' => 2]);
        Product::factory()->create(['months' => 1]);

        $v2 = $this->get(route('landing'))->assertOk();
        $v2->assertInertia(fn(Assert $page) => $page->component('Public/LandingV2')
            ->where('pricingState', 'ready')->has('plans', 1)
            ->where('plans.0.deviceLimit', 7)->has('plans.0.products', 2)
            ->where('plans.0.products.0.id', $monthly->id)
            ->where('plans.0.products.0.months', 1)
            ->where('plans.0.products.0.priceMinor', 20_123)
            ->where('plans.0.products.0.currency', 'RUB')
            ->where('plans.0.products.1.months', 12)
            ->where('plans.0.products.1.priceMinor', 190_099)
            ->missing('subscription')->missing('subscriptionUrl')->missing('catalogue')->missing('payments'));
        $home = $this->get(route('home'))->assertOk();
        $this->assertSame($home->inertiaProps('plans'), $v2->inertiaProps('plans'));
        $home->assertInertia(fn(Assert $page) => $page->component('Public/Home'));
    }

    /**
     * Preserve a truthful empty state when no active unlimited plan is available.
     *
     * @return void
     */
    public function test_v2_exposes_an_empty_catalogue_without_fallback_prices(): void
    {
        $plan = Plan::factory()->create(['code' => 'unlimited']);
        $plan->forceFill(['status' => 'inactive'])->save();
        Product::factory()->for($plan)->create(['months' => 1]);

        $this->get(route('landing'))->assertOk()->assertInertia(fn(Assert $page) => $page
            ->where('pricingState', 'empty')->has('plans', 0));
    }

    /**
     * Keep V2 available with the shared unavailable state after a pricing query failure.
     *
     * @return void
     */
    public function test_v2_exposes_the_shared_unavailable_state_on_database_failure(): void
    {
        $failOnce = true;
        DB::connection()->beforeExecuting(function (string $query, array $bindings) use (&$failOnce): void {
            if ($failOnce && str_contains($query, '"plans"')) {
                $failOnce = false;
                throw new QueryException('pgsql', $query, $bindings, new PDOException('Simulated query failure'));
            }
        });

        $this->get(route('landing'))->assertOk()->assertInertia(fn(Assert $page) => $page
            ->where('pricingState', 'unavailable')->has('plans', 0));
    }
}
