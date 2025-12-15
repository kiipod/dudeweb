<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Promocode;
use App\Models\User;
use App\Models\UserPromocode;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserPromocode>
 */
class UserPromocodeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => $this->faker->uuid(),
            'user_id' => User::factory(),
            'promocode_id' => Promocode::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    // Состояния для тестирования
    public function forSpecificUser(User $user): UserPromocodeFactory|Factory
    {
        return $this->state(function (array $attributes) use ($user) {
            return [
                'user_id' => $user->id,
            ];
        });
    }

    public function forSpecificPromocode(Promocode $promocode): UserPromocodeFactory|Factory
    {
        return $this->state(function (array $attributes) use ($promocode) {
            return [
                'promocode_id' => $promocode->id,
            ];
        });
    }
}
