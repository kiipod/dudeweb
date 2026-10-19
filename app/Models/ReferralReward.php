<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ReferralRewardStatus;
use Barryvdh\LaravelIdeHelper\Eloquent;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * App\Models\ReferralReward
 *
 * @property int $id
 * @property int $referrer_user_id
 * @property int $referred_user_id
 * @property int $payment_id
 * @property int $days_added
 * @property ReferralRewardStatus $status
 * @property Carbon|null $remote_expires_at_before
 * @property Carbon|null $target_expires_at
 * @property Carbon|null $applied_at
 * @property Carbon|null $last_attempted_at
 * @property int $attempts
 * @property string|null $last_error
 * @property Carbon|null $notified_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Payment $payment
 * @property-read User $referrer
 * @property-read User $referredUser
 * @property-read User $user
 *
 * @method static Builder<static>|ReferralReward newModelQuery()
 * @method static Builder<static>|ReferralReward newQuery()
 * @method static Builder<static>|ReferralReward query()
 * @method static Builder<static>|ReferralReward whereCreatedAt($value)
 * @method static Builder<static>|ReferralReward whereDaysAdded($value)
 * @method static Builder<static>|ReferralReward whereId($value)
 * @method static Builder<static>|ReferralReward whereAppliedAt($value)
 * @method static Builder<static>|ReferralReward whereAttempts($value)
 * @method static Builder<static>|ReferralReward whereLastAttemptedAt($value)
 * @method static Builder<static>|ReferralReward whereLastError($value)
 * @method static Builder<static>|ReferralReward whereNotifiedAt($value)
 * @method static Builder<static>|ReferralReward wherePaymentId($value)
 * @method static Builder<static>|ReferralReward whereReferredUserId($value)
 * @method static Builder<static>|ReferralReward whereReferrerUserId($value)
 * @method static Builder<static>|ReferralReward whereRemoteExpiresAtBefore($value)
 * @method static Builder<static>|ReferralReward whereStatus($value)
 * @method static Builder<static>|ReferralReward whereTargetExpiresAt($value)
 * @method static Builder<static>|ReferralReward whereUpdatedAt($value)
 *
 * @mixin Eloquent
 */
#[Table('referral_rewards')]
class ReferralReward extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'referrer_user_id',
        'referred_user_id',
        'payment_id',
        'days_added',
        'status',
        'remote_expires_at_before',
        'target_expires_at',
        'applied_at',
        'last_attempted_at',
        'attempts',
        'last_error',
        'notified_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'status' => ReferralRewardStatus::class,
        'remote_expires_at_before' => 'immutable_datetime',
        'target_expires_at' => 'immutable_datetime',
        'applied_at' => 'immutable_datetime',
        'last_attempted_at' => 'immutable_datetime',
        'attempts' => 'integer',
        'notified_at' => 'datetime',
    ];

    /**
     * Метод возвращает пользователя, который получил бонус.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referrer_user_id');
    }

    /**
     * Метод возвращает пользователя, который получил бонус.
     *
     * @return BelongsTo
     */
    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referrer_user_id');
    }

    /**
     * Метод возвращает пользователя, который сделал платёж (и стал причиной бонуса).
     *
     * @return BelongsTo
     */
    public function referredUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_user_id');
    }

    /**
     * Метод возвращает платёж, за который начислен бонус.
     *
     * @return BelongsTo
     */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
