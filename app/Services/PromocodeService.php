<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Promocode;
use App\Models\User;
use App\Models\UserPromocode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class PromocodeService
{
    /**
     * @param string $code
     * @param User $user
     * @return Promocode
     * @throws \Throwable
     */
    public function apply(string $code, User $user): Promocode
    {
        return DB::transaction(function () use ($code, $user) {
            $normalizedCode = mb_strtolower(trim($code));

            $promocode = Promocode::where('title', $normalizedCode)
                ->lockForUpdate()
                ->first();

            if (!$promocode) {
                throw new \DomainException('Промокод не найден.');
            }

            if ($promocode->count !== null && $promocode->count <= 0) {
                throw new \DomainException('Лимит промокода исчерпан.');
            }

            if (UserPromocode::where('user_id', $user->id)->exists()) {
                throw new \DomainException('Вы уже использовали промокод.');
            }

            UserPromocode::create([
                'user_id' => $user->id,
                'promocode_id' => $promocode->id,
            ]);

            if ($promocode->count !== null) {
                $promocode->decrement('count');
            }

            return $promocode;
        });
    }

    /**
     * @param int $price
     * @param Promocode $promo
     * @return int
     */
    public function calculatePrice(int $price, Promocode $promo): int
    {
        return match ($promo->type) {
            'percent' => (int) round($price * (100 - $promo->discount_value) / 100),
            'fixed'   => max(0, $price - $promo->discount_value),
        };
    }

    /**
     * @param User $user
     * @param int $percent
     * @return Promocode
     */
    public function createForRefUser(User $user, int $percent = 30): Promocode
    {
        return Promocode::create([
            'user_id' => $user->id,
            'title' => Str::upper(Str::random(8)),
            'type' => 'percent',
            'discount_value' => $percent,
            'count' => 1,
        ]);
    }
}
