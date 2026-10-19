<?php

declare(strict_types=1);

namespace App\Models;

use Barryvdh\LaravelIdeHelper\Eloquent;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * App\Models\Advantage
 *
 * @property int $id
 * @property string $title
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @method static Builder<static>|Advantage newModelQuery()
 * @method static Builder<static>|Advantage newQuery()
 * @method static Builder<static>|Advantage query()
 * @method static Builder<static>|Advantage whereCreatedAt($value)
 * @method static Builder<static>|Advantage whereId($value)
 * @method static Builder<static>|Advantage whereTitle($value)
 * @method static Builder<static>|Advantage whereUpdatedAt($value)
 *
 * @mixin Eloquent
 */
#[Table('advantages')]
class Advantage extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
    ];

    /**
     * Метод возвращает тариф к которому привязаны преимущества
     *
     * @return BelongsToMany
     */
    public function plans(): BelongsToMany
    {
        return $this->belongsToMany(
            Plan::class,
            'plan_advantages',
            'advantage_id',
            'plan_id',
        );
    }
}
