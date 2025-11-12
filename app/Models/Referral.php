<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ReferralFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Referral extends Model
{
    /** @use HasFactory<ReferralFactory> */
    use HasFactory;
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'ref_id',
        'bonus',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'bonus' => 'integer',
    ];

    /**
     * Метод возвращает пользователя, который пригласил
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Метод возвращает пользователя, которого пригласили
     *
     * @return BelongsTo
     */
    public function referralUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ref_id');
    }
}
