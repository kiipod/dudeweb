<?php

declare(strict_types=1);

namespace App\Models;

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
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Payment $payment
 * @property-read User $referredUser
 * @property-read User|null $user
 * @method static Builder<static>|ReferralReward newModelQuery()
 * @method static Builder<static>|ReferralReward newQuery()
 * @method static Builder<static>|ReferralReward query()
 * @method static Builder<static>|ReferralReward whereCreatedAt($value)
 * @method static Builder<static>|ReferralReward whereDaysAdded($value)
 * @method static Builder<static>|ReferralReward whereId($value)
 * @method static Builder<static>|ReferralReward wherePaymentId($value)
 * @method static Builder<static>|ReferralReward whereReferredUserId($value)
 * @method static Builder<static>|ReferralReward whereReferrerUserId($value)
 * @method static Builder<static>|ReferralReward whereUpdatedAt($value)
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
    ];

    /**
     * Метод возвращает пользователя, который ПОЛУЧИЛ бонус.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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
