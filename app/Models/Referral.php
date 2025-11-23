<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Database\Factories\ReferralFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * App\Models\Referral
 *
 * @property string $id
 * @property string $user_id
 * @property string $ref_id
 * @property int|null $bonus
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $referralUser
 * @property-read User $user
 * @method static ReferralFactory factory($count = null, $state = [])
 * @method static Builder<static>|Referral newModelQuery()
 * @method static Builder<static>|Referral newQuery()
 * @method static Builder<static>|Referral query()
 * @method static Builder<static>|Referral whereBonus($value)
 * @method static Builder<static>|Referral whereCreatedAt($value)
 * @method static Builder<static>|Referral whereId($value)
 * @method static Builder<static>|Referral whereRefId($value)
 * @method static Builder<static>|Referral whereUpdatedAt($value)
 * @method static Builder<static>|Referral whereUserId($value)
 * @mixin Eloquent
 */
class Referral extends Model
{
    /** @use HasFactory<ReferralFactory> */
    use HasFactory;
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'ref_id',
        'bonus',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'bonus' => 'integer',
    ];

    /**
     * Метод возвращает пользователя, который пригласил
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Метод возвращает пользователя, которого пригласили
     *
     * @return BelongsTo
     */
    public function referralUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ref_id');
    }
}
