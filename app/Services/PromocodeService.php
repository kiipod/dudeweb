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
     * Находит ручной промокод и проверяет возможность применения к пользователю.
     *
     * @param string $code
     * @param User $user
     *
     * @return Promocode
     *
     * @throws \DomainException
     */
    public function apply(string $code, User $user): Promocode
    {
        if ($this->automaticForUser($user) !== null) {
            throw new \DomainException('Для вас уже действует автоматический промокод.');
        }

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
     * Проверяет владельца, остаток использований и историю применения промокода.
     *
     * @param Promocode $promocode
     * @param User $user
     *
     * @return void
     *
     * @throws \DomainException
     */
    public function validateForUser(Promocode $promocode, User $user): void
    {
        if ($promocode->user_id !== null && $promocode->user_id !== $user->id) {
            throw new \DomainException('Промокод недоступен.');
        }

        if ($promocode->count !== null && $promocode->count <= 0) {
            throw new \DomainException('Лимит промокода исчерпан.');
        }

        if (UserPromocode::query()->where('user_id', $user->id)->exists()) {
            throw new \DomainException('Вы уже использовали промокод.');
        }
    }

    /**
     * Находит доступный автоматический промокод до его первого использования.
     *
     * @param User $user
     *
     * @return Promocode|null
     */
    public function automaticForUser(User $user): ?Promocode
    {
        if (UserPromocode::query()->whereBelongsTo($user)->exists()) {
            return null;
        }

        return Promocode::query()
            ->whereBelongsTo($user)
            ->where(static function ($query): void {
                $query->whereNull('count')
                    ->orWhere('count', '>', 0);
            })
            ->oldest('id')
            ->first();
    }

    /**
     * Выбирает промокод оплаты, исключая совмещение ручной и автоматической скидки.
     *
     * @param User $user
     * @param Promocode|null $requestedPromocode
     *
     * @return Promocode|null
     *
     * @throws \DomainException
     */
    public function resolveForPayment(User $user, ?Promocode $requestedPromocode = null): ?Promocode
    {
        $automaticPromocode = $this->automaticForUser($user);

        if ($automaticPromocode === null) {
            return $requestedPromocode;
        }

        if ($requestedPromocode !== null && ! $requestedPromocode->is($automaticPromocode)) {
            throw new \DomainException('Нельзя применить ручной промокод поверх автоматического.');
        }

        return $automaticPromocode;
    }

    /**
     * Применяет фиксированную или процентную скидку без отрицательной итоговой цены.
     *
     * @param int $price
     * @param Promocode $promo
     *
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
     * Однократно расходует промокод для пользователя под блокировкой записей.
     *
     * @param Promocode $promocode
     * @param User $user
     *
     * @return void
     *
     * @throws \DomainException
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
     * Создаёт персональную скидку приглашённому пользователю или возвращает существующую.
     *
     * @param User $user
     * @param int $percent
     *
     * @return Promocode
     *
     * @throws \Throwable
     */
    public function createForRefUser(User $user, int $percent = 30): Promocode
    {
        return DB::transaction(function () use ($user, $percent): Promocode {
            User::query()->lockForUpdate()->findOrFail($user->id);

            $promocode = Promocode::query()
                ->whereBelongsTo($user)
                ->first();

            if ($promocode !== null) {
                return $promocode;
            }

            return Promocode::query()->create([
                'user_id' => $user->id,
                'title' => Str::upper(Str::random(8)),
                'type' => 'percent',
                'discount_value' => $percent,
                'count' => 1,
            ]);
        });
    }
}
