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
 * @property int $bonus
 * @property string $bonus_type
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder<static>|ReferralBonuses newModelQuery()
 * @method static Builder<static>|ReferralBonuses newQuery()
 * @method static Builder<static>|ReferralBonuses query()
 * @method static Builder<static>|ReferralBonuses whereBonus($value)
 * @method static Builder<static>|ReferralBonuses whereBonusType($value)
 * @method static Builder<static>|ReferralBonuses whereCreatedAt($value)
 * @method static Builder<static>|ReferralBonuses whereId($value)
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
        'id',
        'bonus',
        'bonus_type',
    ];
}
