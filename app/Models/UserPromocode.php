<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * App\Model\UserPromocode
 *
 * @property string $id
 * @property string $user_id
 * @property string $promocode_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Promocode $promocode
 * @property-read User $user
 * @method static Builder<static>|UserPromocode newModelQuery()
 * @method static Builder<static>|UserPromocode newQuery()
 * @method static Builder<static>|UserPromocode query()
 * @method static Builder<static>|UserPromocode whereCreatedAt($value)
 * @method static Builder<static>|UserPromocode whereId($value)
 * @method static Builder<static>|UserPromocode wherePromocodeId($value)
 * @method static Builder<static>|UserPromocode whereUpdatedAt($value)
 * @method static Builder<static>|UserPromocode whereUserId($value)
 * @mixin Eloquent
 */
class UserPromocode extends Model
{
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'promocode_id',
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo
     */
    public function promocode(): BelongsTo
    {
        return $this->belongsTo(Promocode::class);
    }
}
