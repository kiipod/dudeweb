<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * App\Models\Order
 *
 * @property string $id
 * @property string $user_id
 * @property string $product_id
 * @property string $name
 * @property int $amount
 * @property string $currency
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Payment|null $payment
 * @property-read Product $product
 * @property-read User $user
 * @method static OrderFactory factory($count = null, $state = [])
 * @method static Builder<static>|Order newModelQuery()
 * @method static Builder<static>|Order newQuery()
 * @method static Builder<static>|Order query()
 * @method static Builder<static>|Order whereAmount($value)
 * @method static Builder<static>|Order whereCreatedAt($value)
 * @method static Builder<static>|Order whereCurrency($value)
 * @method static Builder<static>|Order whereId($value)
 * @method static Builder<static>|Order whereName($value)
 * @method static Builder<static>|Order whereProductId($value)
 * @method static Builder<static>|Order whereUpdatedAt($value)
 * @method static Builder<static>|Order whereUserId($value)
 * @mixin Eloquent
 */
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'product_id',
        'name',
        'amount',
        'currency',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'amount' => 'integer',
    ];

    /**
     * Метод возвращает пользователя, сделавшего заказ
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Метод возвращает продукт в заказе
     *
     * @return BelongsTo
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Метод возвращает платеж заказа
     *
     * @return HasOne
     */
    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}
