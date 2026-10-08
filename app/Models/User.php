<?php

declare(strict_types=1);

namespace App\Models;

use App\Bot\Telegram\Enums\UserTags;
use App\Payment\Enums\PaymentStatus;
use Barryvdh\LaravelIdeHelper\Eloquent;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\DatabaseNotificationCollection;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * App\Model\User
 *
 * @property int $id
 * @property string|null $first_name
 * @property string|null $last_name
 * @property string $username
 * @property int $chat_id
 * @property Carbon|null $trial_expired
 * @property bool $is_premium
 * @property int|null $referrer_user_id
 * @property UserTags $tags
 * @property string|null $welcome_back_shown_at
 * @property Carbon|null $subscription_reminder_sent_for
 * @property Carbon|null $device_limit_exceeded_at
 * @property Carbon|null $device_limit_notification_sent_at
 * @property string|null $state
 * @property array<array-key, mixed>|null $state_payload
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read DatabaseNotificationCollection<int, DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read Collection<int, Payment> $payments
 * @property-read int|null $payments_count
 * @property-read Payment|null $latestSuccessfulPayment
 * @property-read Collection<int, ReferralReward> $receivedReferralRewards
 * @property-read int|null $received_referral_rewards_count
 * @property-read Collection<int, ReferralReward> $referralRewardsFromFriends
 * @property-read int|null $referral_rewards_from_friends_count
 * @property-read Collection<int, User> $referrals
 * @property-read int|null $referrals_count
 * @property-read User|null $referrer
 * @method static Builder<static>|User newModelQuery()
 * @method static Builder<static>|User newQuery()
 * @method static Builder<static>|User query()
 * @method static Builder<static>|User whereChatId($value)
 * @method static Builder<static>|User whereCreatedAt($value)
 * @method static Builder<static>|User whereDeviceLimitExceededAt($value)
 * @method static Builder<static>|User whereDeviceLimitNotificationSentAt($value)
 * @method static Builder<static>|User whereFirstName($value)
 * @method static Builder<static>|User whereId($value)
 * @method static Builder<static>|User whereIsPremium($value)
 * @method static Builder<static>|User whereLastName($value)
 * @method static Builder<static>|User whereReferrerUserId($value)
 * @method static Builder<static>|User whereState($value)
 * @method static Builder<static>|User whereStatePayload($value)
 * @method static Builder<static>|User whereSubscriptionReminderSentFor($value)
 * @method static Builder<static>|User whereTags($value)
 * @method static Builder<static>|User whereTrialExpired($value)
 * @method static Builder<static>|User whereUpdatedAt($value)
 * @method static Builder<static>|User whereUsername($value)
 * @method static Builder<static>|User whereWelcomeBackShownAt($value)
 * @mixin Eloquent
 */
#[Table('users')]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'chat_id',
        'trial_expired',
        'is_premium',
        'referrer_user_id',
        'tags',
        'welcome_back_shown_at',
        'subscription_reminder_sent_for',
        'device_limit_exceeded_at',
        'device_limit_notification_sent_at',
        'state',
        'state_payload',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'chat_id' => 'integer',
        'trial_expired' => 'datetime',
        'subscription_reminder_sent_for' => 'datetime',
        'device_limit_exceeded_at' => 'datetime',
        'device_limit_notification_sent_at' => 'datetime',
        'is_premium' => 'boolean',
        'state_payload' => 'array',
        'tags' => UserTags::class,
    ];

    /**
     * Метод возвращает пользователя, который пригласил текущего.
     *
     * @return BelongsTo
     */
    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referrer_user_id');
    }

    /**
     * Метод возвращает пользователей, которых пригласил этот юзер.
     *
     * @return HasMany
     */
    public function referrals(): HasMany
    {
        return $this->hasMany(User::class, 'referrer_user_id');
    }

    /**
     * Метод возвращает платежи пользователя.
     *
     * @return HasMany
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Возвращает последний созданный успешный платёж с выбранным продуктом.
     *
     * @return HasOne
     */
    public function latestSuccessfulPayment(): HasOne
    {
        return $this->hasOne(Payment::class)->ofMany(
            ['id' => 'max'],
            static function (Builder $query): void {
                $query
                    ->where('status', PaymentStatus::Succeeded)
                    ->whereNotNull('product_id');
            },
        );
    }

    /**
     * Метод возвращает все бонусы, которые получил этот пользователь.
     *
     * @return HasMany
     */
    public function receivedReferralRewards(): HasMany
    {
        return $this->hasMany(ReferralReward::class, 'referrer_user_id');
    }

    /**
     * Метод возвращает все бонусы, которые были начислены из-за приглашённых пользователей.
     *
     * @return HasMany
     */
    public function referralRewardsFromFriends(): HasMany
    {
        return $this->hasMany(ReferralReward::class, 'referred_user_id');
    }
}
