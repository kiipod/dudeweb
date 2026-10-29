<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Services\Account\AccountConnectionDevices;
use App\Services\Account\ConnectionCatalogue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

final class AccountConnectionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Настраивает fake provider boundary и запрещает случайные внешние запросы.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        config(['services.remnawave.api_url' => 'https://panel.test', 'services.remnawave.token' => 'private-api-token']);
        Http::preventStrayRequests();
    }

    /**
     * Защищает чтение и удаление от guest и неподтверждённой сессии.
     *
     * @return void
     */
    public function test_routes_require_a_verified_web_session(): void
    {
        $this->get('/account/connection')->assertRedirect('/login');
        $this->deleteJson('/account/connection/devices')->assertUnauthorized();
        $this->actingAs(User::factory()->web()->create(), 'web');
        $this->get('/account/connection')->assertRedirect('/email/verify');
        $this->deleteJson('/account/connection/devices')->assertForbidden();
        Http::assertNothingSent();
    }

    /**
     * Проверяет owner props, шифрование history и backend-каталог реальных приложений.
     *
     * @return void
     */
    public function test_connection_exposes_only_owned_safe_data_and_prepared_catalogue(): void
    {
        $user = $this->user();
        $this->remote();
        $response = $this->actingAs($user, 'web')->get('/account/connection?user_id=999');
        $response->assertOk()->assertHeader('Cache-Control', 'no-store, private')
            ->assertViewHas('page', fn(array $page): bool => $page['encryptHistory'] === true)
            ->assertInertia(fn(Assert $page) => $page->component('Account/Connection')
                ->where('serviceState', 'ready')->where('deviceCount', 2)->where('deviceLimit', 5)
                ->where('subscriptionUrl', 'https://sub.example.test/owned-link')
                ->where('devices.0.name', 'Мой ноутбук')->has('devices.0.token')
                ->missing('devices.0.hwid')->missing('devices.0.userId')->missing('devices.0.requestIp')
                ->has('platforms', 5)->where('platforms.0.id', 'windows')
                ->where('platforms.0.apps.0.name', 'INCY')
                ->where('platforms.0.apps.0.steps.0.links.0.url', 'https://github.com/INCY-DEV/incy-platforms/releases/latest/download/incy-windows-setup.exe')
                ->where('platforms.0.apps.0.steps.1.links.0.url', 'incy://add/https://sub.example.test/owned-link')
                ->where('platforms.2.apps.0.name', 'Happ')->where('platforms.3.apps.0.name', 'v2rayTUN'));
        $props = $response->viewData('page')['props'];
        foreach (['private-api-token', 'hidden-hwid-0', 'private-password', 'private-ip', 'private-agent', 'hidden-squad'] as $secret) {
            self::assertStringNotContainsString($secret, json_encode($props, JSON_THROW_ON_ERROR));
        }
        Http::assertSentCount(2);
        Http::assertSent(fn(Request $request): bool => $request->url() === 'https://panel.test/api/users/42');
    }

    /**
     * Перечисляет count endpoints без самостоятельной копии device-limit rules.
     *
     * @return array<string, array{int}>
     */
    public static function counts(): array
    {
        return ['empty' => [0], 'below' => [4], 'limit' => [5], 'over' => [6]];
    }

    /**
     * Передаёт точные provider counts и limit, включая over-limit.
     *
     * @param int $count
     *
     * @return void
     */
    #[DataProvider('counts')]
    public function test_device_counts_come_from_the_owned_provider_response(int $count): void
    {
        $this->remote($count);
        $this->actingAs($this->user(), 'web')->get('/account/connection')->assertOk()
            ->assertInertia(fn(Assert $page) => $page->where('deviceCount', $count)->where('deviceLimit', 5)->has('devices', $count));
    }

    /**
     * При отсутствии mapping не выполняет remote reads и не разрешает mutation.
     *
     * @return void
     */
    public function test_missing_mapping_is_honest_unavailable(): void
    {
        $this->actingAs(User::factory()->web()->verified()->create(), 'web')->get('/account/connection')->assertOk()
            ->assertInertia(fn(Assert $page) => $page->where('serviceState', 'service_error')->where('subscriptionUrl', null)->where('deviceCount', null)->has('devices', 0));
        $this->deleteJson('/account/connection/devices', ['device' => 'untrusted'])->assertForbidden();
        Http::assertNothingSent();
    }

    /**
     * Remote timeout не выдаётся за старую подписку; следующий запрос читает fresh data.
     *
     * @return void
     */
    public function test_timeout_and_retry_never_return_stale_secrets(): void
    {
        Http::fake(['panel.test/*' => Http::failedConnection()]);
        $this->actingAs($this->user(), 'web')->get('/account/connection')->assertOk()
            ->assertInertia(fn(Assert $page) => $page->where('serviceState', 'service_error')->where('subscriptionUrl', null)->has('devices', 0));
        $this->remote();
        $this->get('/account/connection')->assertOk()->assertInertia(fn(Assert $page) => $page->where('serviceState', 'ready'));
    }

    /**
     * Отклоняет чужую identity или чужое устройство без раскрытия partial data.
     *
     * @return void
     */
    public function test_remote_identity_and_each_device_must_match_session_owner(): void
    {
        $this->actingAs($this->user(), 'web');
        foreach ([['id' => 999], ['deviceOwner' => 999]] as $overrides) {
            $this->remote(overrides: $overrides);
            $this->get('/account/connection')->assertOk()->assertInertia(fn(Assert $page) => $page->where('serviceState', 'service_error')->where('subscriptionUrl', null)->has('devices', 0));
        }
    }

    /**
     * Missing/unsafe subscription URL не превращается в placeholder или import link.
     *
     * @return void
     */
    public function test_missing_url_and_platform_data_are_unavailable_without_fake_links(): void
    {
        config(['connection.catalogue_path' => resource_path('data/nonexistent-catalogue.json')]);
        $this->remote(overrides: ['subscriptionUrl' => 'javascript:alert(1)', 'hwidDeviceLimit' => null]);
        $this->actingAs($this->user(), 'web')->get('/account/connection')->assertOk()
            ->assertInertia(fn(Assert $page) => $page->where('serviceState', 'ready')->where('subscriptionUrl', null)->where('deviceLimit', null)
                ->has('platforms', 5)->where('platforms.0.available', false)->has('platforms.0.apps', 0));
    }

    /**
     * Доступный каталог не создаёт import links при невалидной ссылке владельца.
     *
     * @return void
     */
    public function test_unsafe_subscription_url_does_not_enter_import_links(): void
    {
        $this->remote(overrides: ['subscriptionUrl' => 'https://user:password@sub.example.test/unsafe']);
        $this->actingAs($this->user(), 'web')->get('/account/connection')->assertOk()
            ->assertInertia(fn(Assert $page) => $page->where('subscriptionUrl', null)
                ->where('platforms.0.available', true)->has('platforms.0.apps.0.steps.1.links', 0));
    }

    /**
     * Отбрасывает unsafe downloads из source и не исполняет неизвестные схемы.
     *
     * @return void
     */
    public function test_catalogue_rejects_unsafe_source_downloads(): void
    {
        $source = json_decode(file_get_contents(resource_path('data/connection-apps.json')), true, flags: JSON_THROW_ON_ERROR);
        $app = $source['platforms']['windows']['apps'][0];
        $app['blocks'][0]['buttons'][0]['url'] = 'javascript:alert(1)';
        $source['platforms']['windows']['apps'] = [$app];
        $path = tempnam(sys_get_temp_dir(), 'connection-catalogue-');
        try {
            file_put_contents($path, json_encode($source, JSON_THROW_ON_ERROR));
            $catalogue = new ConnectionCatalogue($path)->platforms();
            self::assertFalse($catalogue[0]['available']);
            self::assertTrue($catalogue[1]['available']);
        } finally {
            unlink($path);
        }
    }

    /**
     * Повторно подтверждает ownership и передаёт remote ID только из session mapping.
     *
     * @return void
     */
    public function test_delete_uses_fresh_owned_hwid_and_replay_never_deletes_twice(): void
    {
        $user = $this->user();
        $token = app(AccountConnectionDevices::class)->token($user, 'hidden-hwid-0');
        $deleted = false;
        $this->remote(afterDelete: $deleted);
        $this->actingAs($user, 'web')->delete('/account/connection/devices', ['device' => $token, 'user_id' => 999, 'hwid' => 'foreign'])
            ->assertRedirect(route('account.connection'))->assertSessionHas('connection.device_removed', true);
        $this->deleteJson('/account/connection/devices', ['device' => $token])->assertUnprocessable()->assertJsonValidationErrors('device');
        Http::assertSent(fn(Request $request): bool => $request->method() === 'POST'
            && $request->url() === 'https://panel.test/api/hwid/devices/delete'
            && $request->data() === ['userId' => 42, 'hwid' => 'hidden-hwid-0']);
        self::assertCount(1, Http::recorded(fn(Request $request): bool => $request->method() === 'POST'));
    }

    /**
     * Session другого владельца не может использовать encrypted token первого.
     *
     * @return void
     */
    public function test_foreign_token_and_changed_mapping_are_rejected_before_remote_access(): void
    {
        $owner = $this->user();
        $token = app(AccountConnectionDevices::class)->token($owner, 'hidden-hwid-0');
        $other = User::factory()->web()->verified()->create(['remnawave_user_id' => 77]);
        $this->actingAs($other, 'web')->deleteJson('/account/connection/devices', ['device' => $token])->assertForbidden();
        $owner->forceFill(['remnawave_user_id' => 88])->save();
        $this->flushSession();
        $this->actingAs($owner, 'web')->deleteJson('/account/connection/devices', ['device' => $token])->assertForbidden();
        Http::assertNothingSent();
    }

    /**
     * Reject tampering/missing token and never echo remote error details.
     *
     * @return void
     */
    public function test_delete_validation_and_provider_failure_are_safe(): void
    {
        $user = $this->user();
        $this->actingAs($user, 'web');
        foreach ([[], ['device' => 'tampered'], ['device' => str_repeat('x', 4097)]] as $payload) {
            $this->deleteJson('/account/connection/devices', $payload)->assertUnprocessable()->assertJsonValidationErrors('device');
        }
        $token = app(AccountConnectionDevices::class)->token($user, 'hidden-hwid-0');
        Http::fake(['panel.test/*' => Http::response(['message' => 'private-api-token'], 503)]);
        $this->deleteJson('/account/connection/devices', ['device' => $token])->assertUnprocessable()
            ->assertJsonValidationErrors('device')->assertDontSee('private-api-token');
        Http::assertNotSent(fn(Request $request): bool => $request->method() === 'POST');
    }

    /**
     * Ошибка HWID POST после ownership check не считается успешным удалением.
     *
     * @return void
     */
    public function test_provider_revoke_failure_returns_safe_validation_without_success(): void
    {
        $user = $this->user();
        $token = app(AccountConnectionDevices::class)->token($user, 'hidden-hwid-0');
        $this->remote(deleteStatus: 503);
        $this->actingAs($user, 'web')->deleteJson('/account/connection/devices', ['device' => $token])
            ->assertUnprocessable()->assertJsonValidationErrors('device')->assertSessionMissing('connection.device_removed');
        Http::assertSentCount(3);
        self::assertCount(1, Http::recorded(fn(Request $request): bool => $request->method() === 'POST'));
    }

    /**
     * Создаёт verified account с собственным numeric provider mapping.
     *
     * @return User
     */
    private function user(): User
    {
        return User::factory()->web()->verified()->create(['remnawave_user_id' => 42]);
    }

    /**
     * Подменяет provider reads/mutation с timeouts и без реальных side effects.
     *
     * @param int $count
     * @param array<string, mixed> $overrides
     * @param bool|null $afterDelete
     * @param int $deleteStatus
     *
     * @return void
     */
    private function remote(int $count = 2, array $overrides = [], ?bool &$afterDelete = null, int $deleteStatus = 200): void
    {
        Http::swap(new \Illuminate\Http\Client\Factory());
        Http::preventStrayRequests();
        Http::fake(function (Request $request, array $options) use ($count, $overrides, &$afterDelete, $deleteStatus) {
            self::assertSame(5, $options['timeout']);
            self::assertSame(3, $options['connect_timeout']);
            if ($request->method() === 'POST') {
                $afterDelete = $deleteStatus === 200;
                return Http::response(['response' => ['total' => 0, 'devices' => []]], $deleteStatus);
            }
            if (str_ends_with($request->url(), '/users/42')) {
                return Http::response(['response' => [
                    'id' => $overrides['id'] ?? 42, 'shortUuid' => 'private-short', 'username' => 'remote-name',
                    'status' => 'ACTIVE', 'tag' => 'ACTIVE', 'trafficLimitBytes' => 0, 'trafficLimitStrategy' => 'NO_RESET',
                    'expireAt' => now()->addDays(10)->toIso8601String(), 'hwidDeviceLimit' => 5,
                    'trojanPassword' => 'private-password', 'vlessUuid' => 'private-vless', 'ssPassword' => 'private-password',
                    'subscriptionUrl' => 'https://sub.example.test/owned-link', 'activeInternalSquads' => [], 'lastTriggeredThreshold' => 0,
                    'createdAt' => now()->toIso8601String(), 'updatedAt' => now()->toIso8601String(),
                    'userTraffic' => ['usedTrafficBytes' => 0, 'lifetimeUsedTrafficBytes' => 0], ...$overrides,
                ]]);
            }
            $devices = [];
            for ($i = 0; $i < ($afterDelete ? 0 : $count); $i++) {
                $devices[] = ['userId' => $overrides['deviceOwner'] ?? 42, 'hwid' => "hidden-hwid-{$i}",
                    'deviceModel' => 'Мой ноутбук', 'platform' => 'Windows', 'osVersion' => '11',
                    'userAgent' => 'private-agent', 'requestIp' => 'private-ip',
                    'createdAt' => now()->toIso8601String(), 'updatedAt' => now()->toIso8601String()];
            }
            return Http::response(['response' => ['total' => count($devices), 'devices' => $devices]]);
        });
    }
}
