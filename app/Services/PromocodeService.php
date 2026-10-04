<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Promocode;
use App\Models\User;
use App\Models\UserPromocode;
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
        $normalizedCode = mb_strtolower(trim($code));

        $promocode = Promocode::query()
            ->whereRaw('LOWER(title) = ?', [$normalizedCode])
            ->first();

        if ($promocode === null) {
            throw new \DomainException('Промокод не найден.');
        }

        $this->validateForUser($promocode, $user);

        return $promocode;
    }

    /**
     * @param Promocode $promocode
     * @param User $user
     * @return void
     */
    public function validateForUser(Promocode $promocode, User $user): void
    {
        if ($promocode->count !== null && $promocode->count <= 0) {
            throw new \DomainException('Лимит промокода исчерпан.');
        }

        if (UserPromocode::query()->where('user_id', $user->id)->exists()) {
            throw new \DomainException('Вы уже использовали промокод.');
        }
    }

    /**
     * @param int $price
     * @param Promocode $promo
     * @return int
     */
    public function calculatePrice(int $price, Promocode $promo): int
    {
        return match ($promo->type) {
            'percent' => max(0, (int) round($price * (100 - $promo->discount_value) / 100)),
            'fixed'   => max(0, $price - $promo->discount_value),
        };
    }

    /**
     * @param Promocode $promocode
     * @param User $user
     * @return void
     */
    public function markAsUsed(Promocode $promocode, User $user): void
    {
        $lockedUser = User::query()->lockForUpdate()->findOrFail($user->id);
        $usage = UserPromocode::query()
            ->where('user_id', $lockedUser->id)
            ->first();

        if ($usage !== null) {
            if ($usage->promocode_id !== $promocode->id) {
                throw new \DomainException('Пользователь уже использовал другой промокод.');
            }

            return;
        }

        $lockedPromocode = Promocode::query()
            ->lockForUpdate()
            ->findOrFail($promocode->id);

        if ($lockedPromocode->count !== null && $lockedPromocode->count <= 0) {
            throw new \DomainException('Лимит промокода исчерпан.');
        }

        UserPromocode::query()->create([
            'user_id' => $lockedUser->id,
            'promocode_id' => $lockedPromocode->id,
        ]);

        if ($lockedPromocode->count !== null) {
            $lockedPromocode->decrement('count');
        }
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
