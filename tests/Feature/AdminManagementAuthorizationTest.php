<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\MoonShine\Resources\MoonShineUser\MoonShineUserResource;
use App\MoonShine\Resources\MoonShineUserRole\MoonShineUserRoleResource;
use Illuminate\Foundation\Testing\RefreshDatabase;
use MoonShine\Laravel\Database\Factories\MoonshineUserRoleFactory;
use MoonShine\Laravel\Models\MoonshineUser;
use MoonShine\Support\Enums\Ability;
use Tests\TestCase;

final class AdminManagementAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Denies administrator and role management to a non-superuser, including direct writes.
     *
     * @return void
     */
    public function test_operator_cannot_manage_administrators_or_roles(): void
    {
        $role = MoonshineUserRoleFactory::new()->create(['id' => 2, 'name' => 'Operator']);
        $this->actingAs(MoonshineUser::factory()->create(['moonshine_user_role_id' => $role->id]), 'moonshine');
        foreach ([MoonShineUserResource::class, MoonShineUserRoleResource::class] as $class) {
            $resource = app($class);
            foreach (Ability::cases() as $ability) {
                self::assertFalse($resource->can($ability), $class . ':' . $ability->value);
            }
            $this->get(route('moonshine.resource.page', ['resourceUri' => $resource->getUriKey(), 'pageUri' => $resource->getFormPage()->getUriKey()]))->assertForbidden();
            $this->post(route('moonshine.crud.store', ['resourceUri' => $resource->getUriKey()]), [])->assertForbidden();
            $this->put(route('moonshine.crud.update', ['resourceUri' => $resource->getUriKey(), 'resourceItem' => 1]), [])->assertForbidden();
            $this->delete(route('moonshine.crud.destroy', ['resourceUri' => $resource->getUriKey(), 'resourceItem' => 1]))->assertForbidden();
            $this->get(route('moonshine.resource.page', ['resourceUri' => $resource->getUriKey(), 'pageUri' => $resource->getIndexPage()->getUriKey()]))->assertForbidden();
        }
    }

    /**
     * Allows superuser capabilities and denies a web-only guard and guest capabilities.
     *
     * @return void
     */
    public function test_management_capabilities_require_a_superuser_panel_session(): void
    {
        foreach ([MoonShineUserResource::class, MoonShineUserRoleResource::class] as $class) {
            self::assertFalse(app($class)->can(Ability::CREATE));
        }
        $this->actingAs(User::factory()->web()->verified()->create(), 'web');
        self::assertFalse(app(MoonShineUserResource::class)->can(Ability::CREATE));
        $this->actingAs(MoonshineUser::factory()->create(['moonshine_user_role_id' => 1]), 'moonshine');
        foreach ([MoonShineUserResource::class, MoonShineUserRoleResource::class] as $class) {
            foreach (Ability::cases() as $ability) {
                self::assertTrue(app($class)->can($ability));
            }
        }
    }

    /**
     * Exercises an actual superuser create and update, preserving legitimate admin access.
     *
     * @return void
     */
    public function test_superuser_can_create_and_update_an_administrator(): void
    {
        $role = MoonshineUserRoleFactory::new()->create(['id' => 2, 'name' => 'Operator']);
        $this->actingAs(MoonshineUser::factory()->create(['moonshine_user_role_id' => 1]), 'moonshine');
        $resource = app(MoonShineUserResource::class);
        $payload = ['name' => 'Audit operator', 'email' => 'audit-operator@example.test',
            'moonshine_user_role_id' => $role->id, 'password' => 'AuditPassword123!', 'password_confirmation' => 'AuditPassword123!'];
        $this->post(route('moonshine.crud.store', ['resourceUri' => $resource->getUriKey()]), $payload)->assertRedirect();
        $operator = MoonshineUser::query()->where('email', $payload['email'])->firstOrFail();
        $payload['name'] = 'Updated operator';
        $this->put(route('moonshine.crud.update', ['resourceUri' => $resource->getUriKey(), 'resourceItem' => $operator->id]), $payload)->assertRedirect();
        self::assertSame('Updated operator', $operator->fresh()->name);
    }


}
