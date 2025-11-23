<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
 * @property Carbon|null $trial_expired
 * @property bool $is_premium
 * @property bool $is_free
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read DatabaseNotificationCollection<int, DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read Collection<int, Order> $orders
 * @property-read int|null $orders_count
 * @property-read Collection<int, Referral> $referrals
 * @property-read int|null $referrals_count
 * @property-read Referral|null $referredBy
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
 * @method static Builder<static>|User whereTrialExpired($value)
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
        'trial_expired',
        'is_premium',
        'is_free',
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
     * Метод возвращает заказы пользователя
     *
     * @return HasMany
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Метод возвращает рефералы пользователя (кого он пригласил)
     *
     * @return HasMany
     */
    public function referrals(): HasMany
    {
        return $this->hasMany(Referral::class, 'user_id');
    }

    /**
     * Метод возвращает кто пригласил текущего пользователя
     *
     * @return HasOne
     */
    public function referredBy(): HasOne
    {
        return $this->hasOne(Referral::class, 'ref_id');
    }
}
