<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\ReferralBonus
 *
 * @property int $id
 * @property int $paid_months
 * @property int $bonus_days
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder<static>|ReferralBonus newModelQuery()
 * @method static Builder<static>|ReferralBonus newQuery()
 * @method static Builder<static>|ReferralBonus query()
 * @method static Builder<static>|ReferralBonus whereBonusDays($value)
 * @method static Builder<static>|ReferralBonus whereCreatedAt($value)
 * @method static Builder<static>|ReferralBonus whereId($value)
 * @method static Builder<static>|ReferralBonus wherePaidMonths($value)
 * @method static Builder<static>|ReferralBonus whereUpdatedAt($value)
 * @mixin Eloquent
 */
#[Table('referral_bonus')]
class ReferralBonus extends Model
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
