<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\ReferralBonuses
 *
 * @property int $id
 * @property int $paid_months
 * @property int $bonus_days
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder<static>|ReferralBonuses newModelQuery()
 * @method static Builder<static>|ReferralBonuses newQuery()
 * @method static Builder<static>|ReferralBonuses query()
 * @method static Builder<static>|ReferralBonuses whereBonusDays($value)
 * @method static Builder<static>|ReferralBonuses whereCreatedAt($value)
 * @method static Builder<static>|ReferralBonuses whereId($value)
 * @method static Builder<static>|ReferralBonuses wherePaidMonths($value)
 * @method static Builder<static>|ReferralBonuses whereUpdatedAt($value)
 * @mixin Eloquent
 */
class ReferralBonuses extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'paid_months',
        'bonus_days',
    ];
}
