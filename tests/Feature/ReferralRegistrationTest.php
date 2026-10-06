<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Bot\Telegram\Enums\OnboardingScenario;
use App\Bot\Telegram\Enums\UserTags;
use App\Models\User;
use App\Remnawave\Enums\UserStatus;
use App\Repositories\UserRepository;
use App\Services\PromocodeService;
use App\Services\UserOnboardingService;
use App\Services\UserService;
use DefStudio\Telegraph\DTO\User as TelegramUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

final class ReferralRegistrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return void
     */
    public function test_self_referral_does_not_create_relation_or_benefits(): void
    {
        $chatId = 123_456;
        $referrerChatId = app(UserService::class)->getReferrerChatId(
            "/start ref_{$chatId}",
            $chatId,
        );

        self::assertNull($referrerChatId);

        $user = app(UserRepository::class)->create(
            $this->telegramUser($chatId),
            null,
        );

        self::assertNull($user->referrer_user_id);
        $this->assertDatabaseCount('promocodes', 0);
        $this->assertDatabaseCount('referral_rewards', 0);
    }

    /**
     * @return void
     */
    public function test_repeated_self_referral_does_not_change_user_or_create_benefits(): void
    {
        $chatId = 123_456;
        $repository = app(UserRepository::class);
        $user = $repository->create($this->telegramUser($chatId), null);
        $referrerChatId = app(UserService::class)->getReferrerChatId(
            "/start ref_{$chatId}",
            $chatId,
        );

        $sameUser = $repository->create(
            $this->telegramUser($chatId),
            $referrerChatId,
        );

        self::assertSame($user->id, $sameUser->id);
        self::assertNull($sameUser->referrer_user_id);
        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseCount('promocodes', 0);
        $this->assertDatabaseCount('referral_rewards', 0);
    }

    /**
     * @return void
     */
    public function test_valid_referrer_is_assigned_on_first_registration(): void
    {
        $referrer = User::factory()->create(['chat_id' => 654_321]);
        $currentChatId = 123_456;
        $referrerChatId = app(UserService::class)->getReferrerChatId(
            "/start ref_{$referrer->chat_id}",
            $currentChatId,
        );

        self::assertSame($referrer->chat_id, $referrerChatId);

        $user = app(UserRepository::class)->create(
            $this->telegramUser($currentChatId),
            $referrer->id,
        );

        self::assertSame($referrer->id, $user->referrer_user_id);
    }

    /**
     * @param UserStatus $status
     * @return void
     */
    #[DataProvider('nonReturningStatuses')]
    public function test_active_limited_and_disabled_users_are_not_returning(UserStatus $status): void
    {
        $createdUser = User::factory()->create([
            'tags' => UserTags::Inactive,
            'welcome_back_shown_at' => null,
        ]);
        $user = User::query()->findOrFail($createdUser->id);

        $scenario = app(UserOnboardingService::class)->resolveScenario($user, $status);

        self::assertSame(OnboardingScenario::MainMenu, $scenario);
    }

    /**
     * @return array<string, array{UserStatus}>
     */
    public static function nonReturningStatuses(): array
    {
        return [
            'ACTIVE' => [UserStatus::Active],
            'LIMITED' => [UserStatus::Limited],
            'DISABLED' => [UserStatus::Disabled],
        ];
    }

    /**
     * @return void
     */
    public function test_expired_inactive_user_is_returning(): void
    {
        $createdUser = User::factory()->create([
            'tags' => UserTags::Inactive,
            'welcome_back_shown_at' => null,
        ]);
        $user = User::query()->findOrFail($createdUser->id);

        $scenario = app(UserOnboardingService::class)->resolveScenario(
            $user,
            UserStatus::Expired,
        );

        self::assertSame(OnboardingScenario::WelcomeBack, $scenario);
    }

    /**
     * @return void
     */
    public function test_existing_referrer_is_not_replaced_by_repeated_start(): void
    {
        $originalReferrer = User::factory()->create();
        $newReferrer = User::factory()->create();
        $user = User::factory()->create([
            'chat_id' => 123_456,
            'referrer_user_id' => $originalReferrer->id,
        ]);

        $updatedUser = app(UserRepository::class)->create(
            $this->telegramUser($user->chat_id),
            $newReferrer->id,
        );

        self::assertSame($originalReferrer->id, $updatedUser->referrer_user_id);
    }

    /**
     * @return void
     */
    public function test_invited_and_returning_eligibility_share_one_automatic_promocode(): void
    {
        $user = User::factory()->create();
        $service = app(PromocodeService::class);

        $invitedPromocode = $service->createForRefUser($user);
        $returningPromocode = $service->createForRefUser($user);

        self::assertSame($invitedPromocode->id, $returningPromocode->id);
        $this->assertDatabaseCount('promocodes', 1);
    }

    /**
     * @param int $chatId
     * @return TelegramUser
     */
    private function telegramUser(int $chatId): TelegramUser
    {
        return TelegramUser::fromArray([
            'id' => $chatId,
            'first_name' => 'Test',
            'last_name' => 'User',
            'username' => "user_{$chatId}",
            'is_premium' => false,
        ]);
    }
}
