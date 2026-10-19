<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * App\Models\Product
 *
 * @property int $id
 * @property int $plan_id
 * @property string $name
 * @property int|null $months
 * @property int $price
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Plan $plan
 *
 * @method static Builder<static>|Product newModelQuery()
 * @method static Builder<static>|Product newQuery()
 * @method static Builder<static>|Product query()
 * @method static Builder<static>|Product whereCreatedAt($value)
 * @method static Builder<static>|Product whereId($value)
 * @method static Builder<static>|Product whereName($value)
 * @method static Builder<static>|Product wherePlanId($value)
 * @method static Builder<static>|Product wherePrice($value)
 * @method static Builder<static>|Product whereStatus($value)
 * @method static Builder<static>|Product whereUpdatedAt($value)
 *
 * @mixin Eloquent
 */
#[Table('products')]
#[UseFactory(ProductFactory::class)]
class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'plan_id',
        'name',
        'price',
        'months',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'price' => 'integer',
        'months' => 'integer',
    ];

    /**
     * Метод возвращает тариф продукта
     *
     * @return BelongsTo
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Возвращает связь payments для текущей записи.
     *
     * @return HasMany
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Скоуп для статуса "Активно"
     *
     * @param Builder $query
     *
     * @return void
     */
    #[Scope]
    public function active(Builder $query): void
    {
        $query->where('status', '=', 'active');
    }

    /**
     * Скоуп для статуса "Неактивно"
     *
     * @param Builder $query
     *
     * @return void
     */
    #[Scope]
    public function inactive(Builder $query): void
    {
        $query->where('status', '=', 'inactive');
    }

    /**
     * Скоуп для статуса "Черновик"
     *
     * @param Builder $query
     *
     * @return void
     */
    #[Scope]
    public function draft(Builder $query): void
    {
        $query->where('status', '=', 'draft');
    }
}
