<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\ReferralRewardStatus;
use App\Models\Payment;
use App\Models\ReferralBonus;
use App\Models\ReferralReward;
use App\Models\User;
use App\Payment\Enums\PaymentStatus;
use App\Services\ReferralService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

final class ReferralServiceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return void
     */
    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    /**
     * @return void
     * @throws \Throwable
     */
    public function test_each_successful_payment_creates_its_own_reward(): void
    {
        Carbon::setTestNow('2026-10-06 12:00:00');
        ReferralBonus::query()->create([
            'paid_months' => 1,
            'bonus_days' => 7,
        ]);
        $referrer = User::factory()->create([
            'trial_expired' => '2026-10-09 12:00:00',
        ]);
        $referredUser = User::factory()->create([
            'referrer_user_id' => $referrer->id,
        ]);
        $payments = Payment::factory()
            ->count(3)
            ->create([
                'user_id' => $referredUser->id,
                'months' => 1,
                'status' => PaymentStatus::Succeeded,
            ]);
        $service = app(ReferralService::class);

        foreach ($payments as $payment) {
            $service->handlePayment($referredUser, $payment);
        }

        $this->assertDatabaseCount('referral_rewards', 3);

        foreach ($payments as $payment) {
            $this->assertDatabaseHas('referral_rewards', [
                'referrer_user_id' => $referrer->id,
                'referred_user_id' => $referredUser->id,
                'payment_id' => $payment->id,
                'days_added' => 7,
                'status' => ReferralRewardStatus::Pending->value,
            ]);
        }

        $reward = ReferralReward::query()->firstOrFail();
        self::assertTrue($referrer->is($reward->user));
        self::assertTrue($referrer->is($reward->referrer));
        self::assertSame('2026-10-09', $referrer->refresh()->trial_expired?->format('Y-m-d'));
    }

    /**
     * @return void
     * @throws \Throwable
     */
    public function test_same_payment_creates_only_one_reward(): void
    {
        ReferralBonus::query()->create([
            'paid_months' => 1,
            'bonus_days' => 7,
        ]);
        $referrer = User::factory()->create([
            'trial_expired' => '2026-10-09 12:00:00',
        ]);
        $referredUser = User::factory()->create([
            'referrer_user_id' => $referrer->id,
        ]);
        $payment = Payment::factory()->create([
            'user_id' => $referredUser->id,
            'months' => 1,
            'status' => PaymentStatus::Succeeded,
        ]);
        $service = app(ReferralService::class);

        $service->handlePayment($referredUser, $payment);
        $service->handlePayment($referredUser, $payment);

        $this->assertDatabaseCount('referral_rewards', 1);
        self::assertSame('2026-10-09', $referrer->refresh()->trial_expired?->format('Y-m-d'));
    }

    /**
     * @return void
     * @throws \Throwable
     */
    public function test_self_referral_does_not_create_reward(): void
    {
        ReferralBonus::query()->create([
            'paid_months' => 1,
            'bonus_days' => 7,
        ]);
        $user = User::factory()->create(['trial_expired' => null]);
        $user->update(['referrer_user_id' => $user->id]);
        $payment = Payment::factory()->create([
            'user_id' => $user->id,
            'months' => 1,
            'status' => PaymentStatus::Succeeded,
        ]);

        app(ReferralService::class)->handlePayment($user->refresh(), $payment);

        $this->assertDatabaseCount('referral_rewards', 0);
        self::assertNull($user->refresh()->trial_expired);
    }
}
