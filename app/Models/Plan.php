<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * App\Model\Plan
 *
 * @property string $id
 * @property string $name
 * @property string|null $short_name
 * @property string $code
 * @property string $description
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Advantage> $advantages
 * @property-read int|null $advantages_count
 * @property-read Collection<int, Product> $products
 * @property-read int|null $products_count
 * @method static Builder<static>|Plan newModelQuery()
 * @method static Builder<static>|Plan newQuery()
 * @method static Builder<static>|Plan query()
 * @method static Builder<static>|Plan whereCode($value)
 * @method static Builder<static>|Plan whereCreatedAt($value)
 * @method static Builder<static>|Plan whereDescription($value)
 * @method static Builder<static>|Plan whereId($value)
 * @method static Builder<static>|Plan whereName($value)
 * @method static Builder<static>|Plan whereShortName($value)
 * @method static Builder<static>|Plan whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Plan extends Model
{
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'short_name',
        'code',
        'description',
    ];

    /**
     * Метод возвращает продукты в этой категории
     *
     * @return HasMany
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Метод возвращает преимущества к которому привязан тариф
     *
     * @return BelongsToMany
     */
    public function advantages(): BelongsToMany
    {
        return $this->belongsToMany(
            Advantage::class,
            'plan_advantages',
            'plan_id',
            'advantage_id',
        );
    }
}
