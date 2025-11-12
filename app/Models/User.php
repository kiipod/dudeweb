<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;
    use Notifiable;
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'chat_id',
        'is_premium',
        'is_free',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'is_premium' => 'boolean',
        'is_free' => 'boolean',
    ];

    /**
     * Метод возвращает заказы пользователя
     *
     * @return HasMany
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Метод возвращает рефералы пользователя (кого он пригласил)
     *
     * @return HasMany
     */
    public function referrals(): HasMany
    {
        return $this->hasMany(Referral::class, 'user_id');
    }

    /**
     * Метод возвращает кто пригласил текущего пользователя
     *
     * @return HasOne
     */
    public function referredBy(): HasOne
    {
        return $this->hasOne(Referral::class, 'ref_id');
    }
}
