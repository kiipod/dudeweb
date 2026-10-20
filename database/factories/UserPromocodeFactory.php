<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Promocode;
use App\Models\User;
use App\Models\UserPromocode;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<UserPromocode> */
#[UseModel(UserPromocode::class)]
final class UserPromocodeFactory extends Factory
{
    /**
     * Создаёт историю использования с реальными связанными factory records.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return ['user_id' => User::factory(), 'promocode_id' => Promocode::factory()];
    }
}
