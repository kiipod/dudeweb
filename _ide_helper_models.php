<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property string $id
 * @property string|null $user_id
 * @property string $title
 * @property int $discount
 * @property int|null $amount
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UserPromocode> $userPromocodes
 * @property-read int|null $user_promocodes_count
 * @method static \Database\Factories\PromocodeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promocode newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promocode newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promocode query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promocode whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promocode whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promocode whereDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promocode whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promocode whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promocode whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Promocode whereUserId($value)
 */
	class Promocode extends \Eloquent {}
}

