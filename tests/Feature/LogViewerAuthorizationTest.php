<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class LogViewerAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Denies guest log access without a null user exception.
     *
     * @return void
     */
    public function test_guest_log_viewer_is_denied_without_a_server_error(): void
    {
        self::assertContains($this->get('/log-viewer')->status(), [302, 403]);
    }

    /**
     * Preserves superuser log access while denying a non-superuser panel session.
     *
     * @return void
     */
    public function test_log_viewer_uses_the_panel_guard_and_superuser_role(): void
    {
        $role = \MoonShine\Laravel\Database\Factories\MoonshineUserRoleFactory::new()->create(['id' => 2, 'name' => 'Operator']);
        $this->actingAs(\MoonShine\Laravel\Models\MoonshineUser::factory()->create(['moonshine_user_role_id' => $role->id]), 'moonshine');
        $this->get('/log-viewer')->assertForbidden();
        $this->actingAs(\MoonShine\Laravel\Models\MoonshineUser::factory()->create(['moonshine_user_role_id' => 1]), 'moonshine');
        $this->get('/log-viewer')->assertOk();
    }


}
