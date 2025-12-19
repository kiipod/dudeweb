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
 * App\Model\PlanAdvantage
 *
 * @property string $id
 * @property string $plan_id
 * @property string $advantage_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Advantage $advantage
 * @property-read Plan $plan
 * @method static Builder<static>|PlanAdvantage newModelQuery()
 * @method static Builder<static>|PlanAdvantage newQuery()
 * @method static Builder<static>|PlanAdvantage query()
 * @method static Builder<static>|PlanAdvantage whereAdvantageId($value)
 * @method static Builder<static>|PlanAdvantage whereCreatedAt($value)
 * @method static Builder<static>|PlanAdvantage whereId($value)
 * @method static Builder<static>|PlanAdvantage wherePlanId($value)
 * @method static Builder<static>|PlanAdvantage whereUpdatedAt($value)
 * @mixin Eloquent
 */
class PlanAdvantage extends Model
{
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'plan_id',
        'advantage_id',
    ];

    /**
     * @return BelongsTo
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * @return BelongsTo
     */
    public function advantage(): BelongsTo
    {
        return $this->belongsTo(Advantage::class);
    }
}
