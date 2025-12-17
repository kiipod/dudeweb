<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\DatabaseNotificationCollection;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * App\Models\User
 *
 * @property string $id
 * @property string|null $first_name
 * @property string|null $last_name
 * @property string $username
 * @property int $chat_id
 * @property bool $is_trial
 * @property bool $is_premium
 * @property bool $is_free
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $referrer_user_id
 * @property-read DatabaseNotificationCollection<int, DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read Collection<int, Payment> $payments
 * @property-read int|null $payments_count
 * @property-read Collection<int, ReferralReward> $receivedReferralRewards
 * @property-read int|null $received_referral_rewards_count
 * @property-read Collection<int, ReferralReward> $referralRewardsFromFriends
 * @property-read int|null $referral_rewards_from_friends_count
 * @property-read Collection<int, User> $referrals
 * @property-read int|null $referrals_count
 * @property-read User|null $referrer
 * @method static UserFactory factory($count = null, $state = [])
 * @method static Builder<static>|User newModelQuery()
 * @method static Builder<static>|User newQuery()
 * @method static Builder<static>|User query()
 * @method static Builder<static>|User whereChatId($value)
 * @method static Builder<static>|User whereCreatedAt($value)
 * @method static Builder<static>|User whereFirstName($value)
 * @method static Builder<static>|User whereId($value)
 * @method static Builder<static>|User whereIsFree($value)
 * @method static Builder<static>|User whereIsPremium($value)
 * @method static Builder<static>|User whereIsTrial($value)
 * @method static Builder<static>|User whereLastName($value)
 * @method static Builder<static>|User whereReferrerUserId($value)
 * @method static Builder<static>|User whereUpdatedAt($value)
 * @method static Builder<static>|User whereUsername($value)
 * @mixin Eloquent
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;
    use Notifiable;
    use HasUuids;

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
        'is_trial',
        'is_premium',
        'is_free',
        'referrer_user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'chat_id' => 'integer',
        'is_trial' => 'boolean',
        'is_premium' => 'boolean',
        'is_free' => 'boolean',
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
