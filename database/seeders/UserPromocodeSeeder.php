<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Promocode;
use App\Models\User;
use App\Models\UserPromocode;
use Illuminate\Database\Seeder;

class UserPromocodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Получаем пользователей и промокоды
        $users = User::limit(5)->get();
        $promocodes = Promocode::limit(10)->get();

        // Каждому пользователю назначаем несколько промокодов
        foreach ($users as $user) {
            // Выбираем случайные промокоды для пользователя
            $userPromocodes = $promocodes->random(rand(1, 3));

            foreach ($userPromocodes as $promocode) {
                // Проверяем, не использовал ли уже пользователь этот промокод
                $exists = UserPromocode::where('user_id', $user->id)
                    ->where('promocode_id', $promocode->id)
                    ->exists();

                if (!$exists) {
                    UserPromocode::factory()
                        ->forSpecificUser($user)
                        ->forSpecificPromocode($promocode)
                        ->create();
                }
            }
        }

        // Создаем дополнительные случайные связи
        UserPromocode::factory()
            ->count(15)
            ->create();
    }
}
