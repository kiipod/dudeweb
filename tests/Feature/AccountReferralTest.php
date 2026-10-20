<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\ReferralRewardStatus;
use App\Models\ReferralBonus;
use App\Models\ReferralInvite;
use App\Models\ReferralReward;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\Account\AccountReferralData;
use App\Services\ReferralInviteService;
use App\Services\ReferralRules;
use App\Services\UserService;
use DefStudio\Telegraph\DTO\User as TelegramUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

final class AccountReferralTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Проверяет guest/unverified boundary обеих read pages.
     *
     * @return void
     */
    public function test_pages_require_verified_web_session(): void
    {
        foreach (['/account/referral', '/account/referral/terms'] as $url) {
            $this->get($url)->assertRedirect('/login');
        }
        $this->actingAs(User::factory()->web()->create(), 'web');
        foreach (['/account/referral', '/account/referral/terms'] as $url) {
            $this->get($url)->assertRedirect('/email/verify');
        }
    }

    /**
     * Проверяет честные нулевые метрики и отсутствие ссылки без mapping.
     *
     * @return void
     */
    public function test_empty_overview_has_no_placeholder_invites(): void
    {
        $this->actingAs(User::factory()->web()->verified()->create(), 'web')->get('/account/referral')
            ->assertOk()->assertHeader('Cache-Control', 'no-store, private')
            ->assertInertia(fn(Assert $page) => $page->component('Account/Referral/Index')
                ->where('metrics', ['invitedCount' => 0, 'bonusDays' => 0])
                ->where('webInviteUrl', null)->where('telegramInviteUrl', null));
        $this->assertDatabaseCount('referral_invites', 0);
    }

    /**
     * Суммирует только APPLIED и не принимает target user из query.
     *
     * @return void
     */
    public function test_overview_aggregates_only_owned_applied_rewards(): void
    {
        $owner = User::factory()->web()->verified()->create();
        User::factory()->count(3)->create(['referrer_user_id' => $owner->id]);
        foreach ([ReferralRewardStatus::Applied, ReferralRewardStatus::Applied, ReferralRewardStatus::Pending, ReferralRewardStatus::Conflict] as $i => $status) {
            ReferralReward::factory()->create(['referrer_user_id' => $owner->id, 'status' => $status, 'days_added' => [7, 21, 99, 88][$i]]);
        }
        $other = ReferralReward::factory()->create(['status' => ReferralRewardStatus::Applied, 'days_added' => 1000]);
        $this->actingAs($owner, 'web')->get('/account/referral?user_id=' . $other->referrer_user_id)
            ->assertInertia(fn(Assert $page) => $page->where('metrics', ['invitedCount' => 3, 'bonusDays' => 28])
                ->missing('recentRewards')->missing('chat_id')->missing('remnawave_user_id'));
        self::assertFalse($owner->relationLoaded('referrals'));
    }

    /**
     * Проверяет фиксированное число queries независимо от числа друзей/rewards.
     *
     * @return void
     */
    public function test_aggregate_query_count_does_not_grow_with_relations(): void
    {
        $owner = User::factory()->web()->verified()->create(['remnawave_user_id' => 87654321]);
        $service = app(AccountReferralData::class);
        $service->overview($owner);
        DB::enableQueryLog();
        DB::flushQueryLog();
        $service->overview($owner);
        $before = count(DB::getQueryLog());
        DB::disableQueryLog();
        User::factory()->count(40)->create(['referrer_user_id' => $owner->id]);
        ReferralReward::factory()->count(10)->create(['referrer_user_id' => $owner->id, 'status' => ReferralRewardStatus::Applied]);
        DB::enableQueryLog();
        DB::flushQueryLog();
        $data = $service->overview($owner);
        self::assertCount($before, DB::getQueryLog());
        self::assertLessThanOrEqual(3, $before);
        self::assertSame(['invitedCount' => 40, 'bonusDays' => 70], $data['metrics']);
        DB::disableQueryLog();
    }

    /**
     * Проверяет stable opaque URLs обоих каналов и null для неполного bot config.
     *
     * @return void
     */
    public function test_two_invites_share_one_stable_remote_token(): void
    {
        config(['services.telegram.bot_username' => 'dudeweb_test_bot']);
        $owner = User::factory()->web()->verified()->create(['remnawave_user_id' => 87654321]);
        $invites = app(ReferralInviteService::class);
        $links = $invites->links($owner);
        self::assertSame($links, $invites->links($owner));
        $token = basename($links['webInviteUrl']);
        self::assertMatchesRegularExpression('/\A[A-Za-z0-9]{40}\z/', $token);
        self::assertSame('https://t.me/dudeweb_test_bot?start=ref_' . $token, $links['telegramInviteUrl']);
        self::assertSame($owner->id, $invites->resolve($token)->id);
        $this->assertDatabaseCount('referral_invites', 1);
        $alias = ReferralInvite::factory()->create(['remnawave_user_id' => $owner->remnawave_user_id]);
        self::assertSame($owner->id, $invites->resolve($alias->token)->id);
        self::assertSame($links, $invites->links($owner));
        config(['services.telegram.bot_username' => null]);
        self::assertNull(app(ReferralInviteService::class)->links($owner)['telegramInviteUrl']);
    }

    /**
     * Проверяет first-valid attribution в session и single automatic discount.
     *
     * @return void
     */
    public function test_web_first_valid_invite_wins_through_registration(): void
    {
        Notification::fake();
        $first = ReferralInvite::factory()->create();
        $second = ReferralInvite::factory()->create();
        $this->get('/invite/' . str_repeat('z', 40))->assertRedirect('/register')->assertSessionMissing('referral.invite');
        $this->get('/invite/' . $first->token)->assertRedirect('/register')->assertSessionHas('referral.invite', $first->token);
        $this->get('/invite/' . $second->token)->assertSessionHas('referral.invite', $first->token);
        $this->post('/register', ['email' => 'invited@example.test', 'password' => 'password123', 'password_confirmation' => 'password123'])
            ->assertRedirect('/email/verify')->assertSessionMissing('referral.invite');
        $created = User::query()->where('email', 'invited@example.test')->firstOrFail();
        self::assertSame(User::query()->where('remnawave_user_id', $first->remnawave_user_id)->value('id'), $created->referrer_user_id);
        $this->assertDatabaseHas('promocodes', ['user_id' => $created->id, 'discount_value' => ReferralRules::FRIEND_DISCOUNT_PERCENT, 'count' => 1]);
        $this->assertDatabaseCount('referral_rewards', 0);
    }

    /**
     * Проверяет opaque inviter без Telegram identity и прежний numeric start.
     *
     * @return void
     */
    public function test_telegram_opaque_and_legacy_invites_resolve_without_identity_leaks(): void
    {
        $owner = User::factory()->web()->verified()->create(['remnawave_user_id' => 87654321]);
        $token = basename(app(ReferralInviteService::class)->links($owner)['webInviteUrl']);
        $referrer = app(UserService::class)->getReferrer('/start ref_' . $token, 123456);
        self::assertSame($owner->id, $referrer->id);
        $user = app(UserRepository::class)->create(TelegramUser::fromArray(['id' => 123456, 'first_name' => 'Друг', 'is_premium' => false]), $referrer->id);
        self::assertSame($owner->id, $user->referrer_user_id);
        $legacy = User::factory()->create(['chat_id' => 654321]);
        self::assertSame($legacy->id, app(UserService::class)->getReferrer('/start ref_654321', 123456)->id);
        self::assertNull(app(UserService::class)->getReferrer('/start ref_654321invalid', 123456));
        app(UserRepository::class)->create(TelegramUser::fromArray(['id' => 123456, 'first_name' => 'Друг', 'is_premium' => false]), $legacy->id);
        self::assertSame($owner->id, $user->fresh()->referrer_user_id);
    }

    /**
     * Отклоняет self-referral между web/Telegram identities одной записи.
     *
     * @return void
     */
    public function test_self_referral_is_ignored_across_channels(): void
    {
        $owner = User::factory()->web()->verified()->create(['chat_id' => 123456, 'remnawave_user_id' => 87654321]);
        $token = basename(app(ReferralInviteService::class)->links($owner)['webInviteUrl']);
        self::assertNull(app(ReferralInviteService::class)->resolve($token, $owner));
        self::assertNull(app(UserService::class)->getReferrer('/start ref_' . $token, 123456));
        $this->actingAs($owner, 'web')->get('/invite/' . $token)->assertRedirect('/account')->assertSessionMissing('referral.invite');
        self::assertNull($owner->fresh()->referrer_user_id);
        $this->assertDatabaseCount('promocodes', 0);
    }

    /**
     * Проверяет live version, canonical ordering/preference и отсутствие mutations.
     *
     * @return void
     */
    public function test_terms_follow_live_rules_and_preference_without_mutations(): void
    {
        foreach ([12 => 30, 1 => 7, 6 => 21, 3 => 14] as $months => $days) {
            ReferralBonus::factory()->create(['paid_months' => $months, 'bonus_days' => $days]);
        }
        $owner = User::factory()->web()->verified()->create();
        $first = app(AccountReferralData::class)->terms();
        ReferralBonus::factory()->create(['paid_months' => 1, 'bonus_days' => 17, 'updated_at' => now()->addMinute()]);
        $this->actingAs($owner, 'web')->get('/account/referral/terms')->assertOk()
            ->assertInertia(fn(Assert $page) => $page->component('Account/Referral/Terms')->where('termsAvailable', true)
                ->where('friendDiscountPercent', ReferralRules::FRIEND_DISCOUNT_PERCENT)
                ->where('rewardMatrix', [['months' => 1, 'days' => 17], ['months' => 3, 'days' => 14], ['months' => 6, 'days' => 21], ['months' => 12, 'days' => 30]]));
        self::assertSame(17, app(ReferralRules::class)->bonusDays(1));
        self::assertNotSame($first['contentVersion'], app(AccountReferralData::class)->terms()['contentVersion']);
        $this->assertDatabaseCount('referral_invites', 0);
        $this->assertDatabaseCount('referral_rewards', 0);
        $this->assertDatabaseCount('promocodes', 0);
    }

    /**
     * Не выдаёт stale Pen matrix при missing/invalid правилах.
     *
     * @return void
     */
    public function test_incomplete_terms_are_unavailable(): void
    {
        ReferralBonus::factory()->create(['paid_months' => 1, 'bonus_days' => 7]);
        $this->actingAs(User::factory()->web()->verified()->create(), 'web')->get('/account/referral/terms')
            ->assertInertia(fn(Assert $page) => $page->where('termsAvailable', false)->where('friendDiscountPercent', null)
                ->where('rewardMatrix', [])->where('contentVersion', null));
        foreach ([3, 6, 12] as $months) {
            ReferralBonus::factory()->create(['paid_months' => $months, 'bonus_days' => 14]);
        }
        ReferralBonus::factory()->create(['paid_months' => 1, 'bonus_days' => 0, 'updated_at' => now()->addMinute()]);
        self::assertFalse(app(AccountReferralData::class)->terms()['termsAvailable']);
    }
}
