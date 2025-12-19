<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * App\Model\Product
 *
 * @property string $id
 * @property string $plan_id
 * @property string $name
 * @property int $price
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Plan $plan
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
 * @mixin Eloquent
 */
class Product extends Model
{
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'plan_id',
        'name',
        'price',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'price' => 'integer',
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
     * Скоуп для статуса "Активно"
     *
     * @param Builder $query
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
     * @return void
     */
    #[Scope]
    public function draft(Builder $query): void
    {
        $query->where('status', '=', 'draft');
    }
}
