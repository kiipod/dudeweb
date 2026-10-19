<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Bot\Telegram\Enums\UserTags;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Product;
use App\Models\User;
use App\Payment\Enums\PaymentStatus;
use App\Policies\AccountDashboardPolicy;
use App\Services\Account\AccountDashboardData;
use App\Services\Auth\ProvisioningState;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Testing\AssertableInertia as Assert;
use MoonShine\Laravel\Models\MoonshineUser;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

final class AccountDashboardTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Изолирует provider и время для проверок актуальных данных кабинета.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->freezeTime();
        $this->travelTo(now()->startOfSecond());
        config(['services.remnawave.api_url' => 'https://panel.test', 'services.remnawave.token' => 'private-api-token']);
        Http::preventStrayRequests();
    }

    /**
     * Проверяет guest, verification и независимость MoonShine guard.
     *
     * @return void
     */
    public function test_account_requires_a_verified_web_session(): void
    {
        $this->get('/account')->assertRedirect('/login');
        $this->actingAs(MoonshineUser::factory()->create(), 'moonshine')->get('/account')->assertRedirect('/login');
        $this->actingAs(User::factory()->web()->create(), 'web')->get('/account')->assertRedirect('/email/verify');
        Http::assertNothingSent();
    }

    /**
     * Проверяет policy как отдельную границу web-кабинета.
     *
     * @return void
     */
    public function test_policy_rejects_telegram_only_and_unverified_accounts(): void
    {
        $policy = new AccountDashboardPolicy();
        self::assertFalse($policy->viewDashboard(User::factory()->create()));
        self::assertFalse($policy->viewDashboard(User::factory()->web()->create()));
        self::assertTrue($policy->viewDashboard(User::factory()->web()->verified()->create()));
    }

    /**
     * Перечисляет lifecycle границы без изменения remote или local tag.
     *
     * @return array<string, array{string, string, int, UserTags, string, int}>
     */
    public static function presentationCases(): array
    {
        return [
            'trial' => ['ACTIVE', 'TRIAL', 259200, UserTags::Inactive, 'trial', 3],
            'active' => ['ACTIVE', 'ACTIVE', 864000, UserTags::Trial, 'active', 10],
            'expiring' => ['ACTIVE', 'ACTIVE', 172800, UserTags::Active, 'expiring', 2],
            'exactly three days' => ['ACTIVE', 'ACTIVE', 259200, UserTags::Active, 'active', 3],
            'one second' => ['ACTIVE', 'ACTIVE', 1, UserTags::Active, 'expiring', 1],
            'expired date' => ['ACTIVE', 'TRIAL', 0, UserTags::Trial, 'expired', 0],
            'remote expired' => ['EXPIRED', 'ACTIVE', 86400, UserTags::Active, 'expired', 1],
            'limited' => ['LIMITED', 'TRIAL', 86400, UserTags::Trial, 'limited', 1],
            'disabled' => ['DISABLED', 'ACTIVE', 86400, UserTags::Active, 'limited', 1],
            'family' => ['ACTIVE', 'TRIAL', 864000, UserTags::Family, 'active', 10],
            'friends' => ['ACTIVE', 'TRIAL', 864000, UserTags::Friends, 'active', 10],
        ];
    }

    /**
     * Проверяет state/expiration по свежему provider и сохранение local classification.
     *
     * @param string $status
     * @param string $tag
     * @param int $seconds
     * @param UserTags $localTag
     * @param string $expected
     * @param int $days
     *
     * @return void
     */
    #[DataProvider('presentationCases')]
    public function test_presentation_uses_remote_truth(
        string $status,
        string $tag,
        int $seconds,
        UserTags $localTag,
        string $expected,
        int $days,
    ): void {
        $user = $this->webUser(['tags' => $localTag]);
        $expiresAt = now()->addSeconds($seconds);
        $remote = $this->remoteUser(['status' => $status, 'tag' => $tag, 'expireAt' => $expiresAt->toIso8601String()]);
        $this->fakeRemote($remote);
        $this->actingAs($user, 'web')->get('/account')->assertOk()
            ->assertHeader('Cache-Control', 'no-store, private')
            ->assertInertia(fn(Assert $page) => $page->component('Account/Dashboard')
                ->where('serviceState', 'ready')
                ->where('subscription.state', $expected)
                ->where('subscription.expiresAt', $expiresAt->copy()->utc()->toIso8601String())
                ->where('subscription.remainingDays', $days)
                ->where('devicesSummary.count', 2)
                ->where('devicesSummary.limit', 5));
        self::assertSame($localTag, $user->refresh()->tags);
        Http::assertSentCount(2);
        Http::assertNotSent(fn(Request $request): bool => $request->method() !== 'GET');
    }

    /**
     * Проверяет owned lookup, минимальный payload и отсутствие секретов.
     *
     * @return void
     */
    public function test_only_the_authenticated_numeric_mapping_is_used_and_secrets_are_omitted(): void
    {
        $user = $this->webUser(['first_name' => 'Алексей']);
        $other = $this->webUser(['remnawave_user_id' => 999]);
        $this->fakeRemote($this->remoteUser(['username' => 'renamed-remotely', 'email' => 'changed@example.test']));
        $response = $this->actingAs($user, 'web')->get('/account?user_id=' . $other->id);
        $response->assertOk()->assertInertia(fn(Assert $page) => $page->has('user', 1)
            ->where('user.displayName', 'Алексей')->where('subscription.url', 'https://sub.example.test/private-link')
            ->missing('auth')->missing('password')->missing('devices')->missing('remote')
            ->missing('user.email')->missing('user.remnawave_user_id')->missing('user.provisioning_key'));
        foreach (['remote-password', 'private-api-token', 'hidden-device-hwid', 'hidden-squad'] as $secret) {
            self::assertStringNotContainsString($secret, $response->getContent());
        }
        Http::assertSent(fn(Request $request): bool => $request->url() === 'https://panel.test/api/users/42');
        Http::assertSent(fn(Request $request): bool => $request->url() === 'https://panel.test/api/hwid/devices/42');
    }

    /**
     * Проверяет тариф по последней собственной успешной покупке и bounded query count.
     *
     * @return void
     */
    public function test_plan_comes_from_the_latest_owned_successful_payment_with_three_queries(): void
    {
        $user = $this->webUser();
        $plan = Plan::factory()->create(['name' => 'Мой действительный тариф']);
        $product = Product::factory()->for($plan)->create();
        Payment::factory()->for($user)->count(10)->create(['status' => PaymentStatus::Succeeded]);
        Payment::factory()->for($user)->for($product)->create(['status' => PaymentStatus::Succeeded]);
        Payment::factory()->for($user)->create(['status' => PaymentStatus::Pending]);
        Payment::factory()->create(['status' => PaymentStatus::Succeeded]);
        $this->fakeRemote($this->remoteUser());
        $queries = [];
        DB::listen(function (QueryExecuted $query) use (&$queries): void {
            $queries[] = $query->sql;
        });
        $data = app(AccountDashboardData::class)->forUser($user);
        self::assertSame('Мой действительный тариф', $data['subscription']['planName']);
        self::assertCount(3, $queries);
        Http::assertSentCount(2);
    }

    /**
     * Проверяет честное состояние при ещё не созданном remote mapping.
     *
     * @return void
     */
    public function test_missing_mapping_requires_provisioning_without_provider_calls(): void
    {
        $user = $this->webUser(['remnawave_user_id' => null, 'provisioning_state' => ProvisioningState::ServiceError]);
        $this->actingAs($user, 'web')->get('/account')->assertOk()
            ->assertInertia(fn(Assert $page) => $page->where('serviceState', 'service_error')
                ->where('provisioningRequired', true)->where('subscription', null)->where('devicesSummary', null));
        Http::assertNothingSent();
    }

    /**
     * Отклоняет foreign identity до получения устройств или передачи подписки.
     *
     * @return void
     */
    public function test_foreign_provider_identity_never_reaches_page_props(): void
    {
        $user = $this->webUser();
        $this->fakeRemote($this->remoteUser(['id' => 999]));
        $this->actingAs($user, 'web')->get('/account')->assertOk()
            ->assertInertia(fn(Assert $page) => $page->where('serviceState', 'service_error')->where('subscription', null));
        Http::assertSentCount(1);
    }

    /**
     * Проверяет timeout и свежий успешный read при ручном повторе.
     *
     * @return void
     */
    public function test_timeout_does_not_show_stale_data_and_retry_performs_fresh_reads(): void
    {
        $user = $this->webUser(['tags' => UserTags::Active]);
        $attempts = 0;
        $remote = $this->remoteUser();
        Http::fake(function (Request $request) use (&$attempts, $remote) {
            if (str_ends_with($request->url(), '/users/42')) {
                $attempts++;
                return $attempts === 1 ? Http::failedConnection('private-link remote-password') : Http::response(['response' => $remote]);
            }
            return Http::response(['response' => ['total' => 0, 'devices' => []]]);
        });
        Log::spy();
        $this->actingAs($user, 'web')->get('/account')->assertOk()
            ->assertInertia(fn(Assert $page) => $page->where('serviceState', 'service_error')
                ->where('subscription', null)->where('devicesSummary', null)->where('provisioningRequired', false));
        Log::shouldHaveReceived('warning')->once()->with('Account dashboard read failed.', \Mockery::on(
            fn(array $context): bool => array_keys($context) === ['user_id', 'exception'] && $context['user_id'] === $user->id,
        ));
        $this->get('/account')->assertOk()->assertInertia(fn(Assert $page) => $page->where('serviceState', 'ready'));
        self::assertSame(2, $attempts);
    }

    /**
     * Не показывает частичную активную подписку при сбое HWID API.
     *
     * @return void
     */
    public function test_device_api_failure_removes_subscription_snapshot(): void
    {
        $user = $this->webUser();
        Http::fake([
            'panel.test/api/users/42' => Http::response(['response' => $this->remoteUser()]),
            'panel.test/api/hwid/devices/42' => Http::response(['message' => 'unavailable'], 503),
        ]);
        $this->actingAs($user, 'web')->get('/account')->assertOk()
            ->assertInertia(fn(Assert $page) => $page->where('serviceState', 'service_error')
                ->where('subscription', null)->where('devicesSummary', null));
    }

    /**
     * Проверяет актуальные количества устройств без local cache.
     *
     * @return void
     */
    public function test_zero_two_and_five_devices_are_read_again_on_each_request(): void
    {
        $user = $this->webUser();
        $total = 0;
        Http::fake(function (Request $request) use (&$total) {
            return Http::response(['response' => str_ends_with($request->url(), '/users/42')
                ? $this->remoteUser()
                : ['total' => $total, 'devices' => []]]);
        });
        $this->actingAs($user, 'web');
        foreach ([0, 2, 5] as $total) {
            $this->get('/account')->assertOk()->assertInertia(fn(Assert $page) => $page->where('devicesSummary.count', $total));
        }
        Http::assertSentCount(6);
    }

    /**
     * Не подменяет отсутствующие лимит и план демонстрационными значениями.
     *
     * @return void
     */
    public function test_missing_plan_limit_and_unsafe_url_remain_explicit(): void
    {
        $user = $this->webUser();
        $this->fakeRemote($this->remoteUser(['hwidDeviceLimit' => null, 'subscriptionUrl' => 'javascript:alert(1)']));
        $this->actingAs($user, 'web')->get('/account')->assertOk()
            ->assertInertia(fn(Assert $page) => $page->where('serviceState', 'ready')
                ->where('subscription.planName', 'Подписка')->where('subscription.url', null)->where('devicesSummary.limit', null));
    }

    /**
     * Удаляет незакрытый диагностический маршрут до публикации кабинета.
     *
     * @return void
     */
    public function test_diagnostic_route_is_not_publicly_available(): void
    {
        $this->get('/test')->assertNotFound();
        Http::assertNothingSent();
    }

    /**
     * Отказывает через policy, даже если Telegram-only аккаунту задан verification timestamp.
     *
     * @return void
     */
    public function test_policy_is_enforced_by_the_dashboard_route(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $this->actingAs($user, 'web')->get('/account')->assertForbidden();
        Http::assertNothingSent();
    }

    /**
     * Не принимает устройства другого пользователя из provider response.
     *
     * @return void
     */
    public function test_foreign_device_summary_is_rejected(): void
    {
        $user = $this->webUser();
        Http::fake([
            'panel.test/api/users/42' => Http::response(['response' => $this->remoteUser()]),
            'panel.test/api/hwid/devices/42' => Http::response(['response' => ['total' => 1, 'devices' => [[
                'hwid' => 'foreign', 'userId' => 999,
                'createdAt' => now()->toIso8601String(), 'updatedAt' => now()->toIso8601String(),
            ]]]]),
        ]);
        $this->actingAs($user, 'web')->get('/account')->assertOk()->assertInertia(
            fn(Assert $page) => $page->where('serviceState', 'service_error')->where('devicesSummary', null),
        );
    }

    /**
     * Не превращает пустую provider date в текущую дату Carbon и ложный trial.
     *
     * @return void
     */
    public function test_missing_expiration_is_not_interpreted_as_current_time(): void
    {
        $user = $this->webUser();
        $this->fakeRemote($this->remoteUser(['expireAt' => '', 'tag' => 'TRIAL']));
        $this->actingAs($user, 'web')->get('/account')->assertOk()->assertInertia(
            fn(Assert $page) => $page->where('serviceState', 'service_error')->where('subscription', null),
        );
        Http::assertSentCount(1);
    }

    /**
     * Защищает history с subscription URL и очищает его ключ после logout.
     *
     * @return void
     */
    public function test_sensitive_history_is_encrypted_and_cleared_on_logout(): void
    {
        $user = $this->webUser();
        $this->fakeRemote($this->remoteUser());
        $this->actingAs($user, 'web')->get('/account')->assertOk()
            ->assertViewHas('page', fn(array $page): bool => $page['encryptHistory'] === true);
        $this->delete('/logout')->assertRedirect('/')->assertSessionHas('inertia.clear_history', true);
        $this->get('/')->assertOk()->assertViewHas('page', fn(array $page): bool => $page['clearHistory'] === true);
        $this->assertGuest('web');
    }

    /**
     * Создаёт подтверждённого владельца numeric remote mapping.
     *
     * @param array<string, mixed> $attributes
     *
     * @return User
     */
    private function webUser(array $attributes = []): User
    {
        return User::factory()->web()->verified()->create([
            'remnawave_user_id' => 42,
            'provisioning_state' => ProvisioningState::Ready,
            ...$attributes,
        ]);
    }

    /**
     * Подменяет две owned GET-операции и проверяет их ограниченные таймауты.
     *
     * @param array<string, mixed> $remote
     *
     * @return void
     */
    private function fakeRemote(array $remote): void
    {
        Http::fake(function (Request $request, array $options) use ($remote) {
            self::assertSame(5, $options['timeout']);
            self::assertSame(3, $options['connect_timeout']);
            return Http::response(['response' => str_ends_with($request->url(), '/users/42')
                ? $remote
                : ['total' => 2, 'devices' => [[
                    'hwid' => 'hidden-device-hwid', 'userId' => 42,
                    'createdAt' => now()->toIso8601String(), 'updatedAt' => now()->toIso8601String(),
                ]]]]);
        });
    }

    /**
     * Формирует полный provider response, секреты которого не должны стать props.
     *
     * @param array<string, mixed> $overrides
     *
     * @return array<string, mixed>
     */
    private function remoteUser(array $overrides = []): array
    {
        return [
            'id' => 42, 'shortUuid' => 'short', 'username' => 'remote-name',
            'email' => 'private@example.test', 'status' => 'ACTIVE', 'tag' => 'ACTIVE',
            'trafficLimitBytes' => 0, 'trafficLimitStrategy' => 'NO_RESET',
            'expireAt' => now()->addDays(10)->toIso8601String(), 'telegramId' => null,
            'hwidDeviceLimit' => 5, 'trojanPassword' => 'remote-password',
            'vlessUuid' => '00000000-0000-4000-8000-000000000002', 'ssPassword' => 'remote-password',
            'createdAt' => now()->toIso8601String(), 'updatedAt' => now()->toIso8601String(),
            'subscriptionUrl' => 'https://sub.example.test/private-link',
            'activeInternalSquads' => [['uuid' => 'hidden-squad', 'name' => 'hidden-squad']],
            'lastTriggeredThreshold' => 0,
            'userTraffic' => ['usedTrafficBytes' => 0, 'lifetimeUsedTrafficBytes' => 0],
            ...$overrides,
        ];
    }
}
