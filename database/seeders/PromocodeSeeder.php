<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Promocode;
use App\Models\User;
use Illuminate\Database\Seeder;

class PromocodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Создаем несколько промокодов без привязки к пользователю (глобальные)
        Promocode::factory()
            ->count(5)
            ->withoutUser()
            ->create();

        // Создаем промокоды с неограниченным количеством использований
        Promocode::factory()
            ->count(3)
            ->unlimited()
            ->create();

        // Создаем промокоды для конкретных пользователей
        $users = User::limit(3)->get();

        foreach ($users as $user) {
            Promocode::factory()
                ->count(2)
                ->state(['user_id' => $user->id])
                ->create();
        }

        // Создаем специальные промокоды со скидкой 50%
        Promocode::factory()
            ->count(2)
            ->withSpecificDiscount(50)
            ->withoutUser()
            ->create();

        // Добавляем несколько случайных промокодов
        Promocode::factory()
            ->count(10)
            ->create();
    }
}
