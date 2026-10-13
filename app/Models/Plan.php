<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Database\Factories\PlanFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * App\Model\Plan
 *
 * @property int $id
 * @property string $name
 * @property string|null $short_name
 * @property string $code
 * @property string $description
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Advantage> $advantages
 * @property-read int|null $advantages_count
 * @property-read Collection<int, Product> $products
 * @property-read int|null $products_count
 * @method static Builder<static>|Plan active()
 * @method static Builder<static>|Plan draft()
 * @method static Builder<static>|Plan inactive()
 * @method static Builder<static>|Plan newModelQuery()
 * @method static Builder<static>|Plan newQuery()
 * @method static Builder<static>|Plan query()
 * @method static Builder<static>|Plan whereCode($value)
 * @method static Builder<static>|Plan whereCreatedAt($value)
 * @method static Builder<static>|Plan whereDescription($value)
 * @method static Builder<static>|Plan whereId($value)
 * @method static Builder<static>|Plan whereName($value)
 * @method static Builder<static>|Plan whereShortName($value)
 * @method static Builder<static>|Plan whereStatus($value)
 * @method static Builder<static>|Plan whereUpdatedAt($value)
 * @mixin Eloquent
 */
#[Table('plans')]
#[UseFactory(PlanFactory::class)]
class Plan extends Model
{
    /** @use HasFactory<\Database\Factories\PlanFactory> */
    use HasFactory;

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
