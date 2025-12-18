<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * App\Model\Promocode
 *
 * @property string $id
 * @property string|null $user_id
 * @property string $title
 * @property int $discount
 * @property int|null $count
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $user
 * @property-read Collection<int, UserPromocode> $userPromocodes
 * @property-read int|null $user_promocodes_count
 * @method static Builder<static>|Promocode newModelQuery()
 * @method static Builder<static>|Promocode newQuery()
 * @method static Builder<static>|Promocode query()
 * @method static Builder<static>|Promocode whereCount($value)
 * @method static Builder<static>|Promocode whereCreatedAt($value)
 * @method static Builder<static>|Promocode whereDiscount($value)
 * @method static Builder<static>|Promocode whereId($value)
 * @method static Builder<static>|Promocode whereTitle($value)
 * @method static Builder<static>|Promocode whereUpdatedAt($value)
 * @method static Builder<static>|Promocode whereUserId($value)
 * @mixin Eloquent
 */
class Promocode extends Model
{
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'user_id',
        'title',
        'discount',
        'count',
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany
     */
    public function userPromocodes(): HasMany
    {
        return $this->hasMany(UserPromocode::class);
    }
}
