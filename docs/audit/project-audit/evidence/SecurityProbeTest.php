<?php

declare(strict_types=1);

namespace Tests\Audit;

use App\Http\Middleware\VerifyTelegramLinkWebhook;
use App\Models\TelegramBot;
use App\MoonShine\Resources\MoonShineUser\MoonShineUserResource;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use MoonShine\Laravel\Models\MoonshineUser;
use MoonShine\Laravel\Database\Factories\MoonshineUserRoleFactory;
use MoonShine\Support\Enums\Ability;
use Tests\TestCase;

/**
 * Diagnostic assertions record current behavior, not remediation acceptance.
 */
final class SecurityProbeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Blocks external HTTP calls before each isolated diagnostic.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        Http::preventStrayRequests();
    }

    /**
     * Records that arbitrary direct peers can spoof the IP allowlist via XFF.
     *
     * @return void
     */
    public function test_forwarded_source_is_accepted_from_an_arbitrary_peer(): void
    {
        config(['yookassa.webhook_allowed_ips' => ['185.71.76.0/27']]);

        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.10'])
            ->postJson('/webhooks/yookassa')->assertForbidden();
        $this->withHeaders(['X-Forwarded-For' => '185.71.76.1'])
            ->postJson('/webhooks/yookassa')->assertStatus(500)
            ->assertJson(['message' => 'Webhook processing failed.']);
    }

    /**
     * Records low-privilege panel access to administrator creation capabilities.
     *
     * @return void
     */
    public function test_non_superuser_can_open_administrator_creation(): void
    {
        $role = MoonshineUserRoleFactory::new()->create(['id' => 2, 'name' => 'Audit operator']);
        $operator = MoonshineUser::factory()->create(['moonshine_user_role_id' => $role->id]);
        $this->assertFalse($operator->isSuperUser());
        $this->actingAs($operator, 'moonshine');
        $resource = app(MoonShineUserResource::class);
        $this->assertFalse($resource->isWithPolicy());
        $this->assertTrue($resource->can(Ability::CREATE));
        $this->get(route('moonshine.resource.page', [
            'resourceUri' => $resource->getUriKey(),
            'pageUri' => $resource->getFormPage()->getUriKey(),
        ]))
            ->assertOk()->assertSee('moonshine_user_role_id');
    }

    /**
     * Compares configured local verification secret with unsent registration data.
     *
     * @return void
     */
    public function test_configured_telegram_secret_is_not_sent_by_default_registration(): void
    {
        config([
            'telegraph.webhook.secret' => 'audit-only-secret',
            'telegraph.webhook.secret_token' => null,
            'telegraph.webhook.domain' => 'https://audit.example.test',
        ]);
        $bot = TelegramBot::factory()->create(['token' => 'audit-only-bot-token']);
        $payload = $bot->registerWebhook()->toArray();
        $this->assertArrayNotHasKey('secret_token', $payload['payload']);

        $request = Request::create('/audit-webhook', 'POST', ['message' => ['text' => '/start link_audit']]);
        try {
            app(VerifyTelegramLinkWebhook::class)->handle($request, fn() => response()->noContent());
            $this->fail('The configured inbound secret must reject the headerless request.');
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
        }
    }
}
