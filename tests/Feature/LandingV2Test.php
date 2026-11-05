<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
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
}
