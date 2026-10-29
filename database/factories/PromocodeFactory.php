<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Promocode;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;

/** @extends Factory<Promocode> */
#[UseModel(Promocode::class)]
final class PromocodeFactory extends Factory
{
    /**
     * Формирует исходные атрибуты модели для фабрики.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'title' => fake()->unique()->lexify('promo????'),
            'type' => 'percent',
            'discount_value' => 30,
            'count' => null,
        ];
    }
}
