<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Promocode;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Promocode> */
final class PromocodeFactory extends Factory
{
    protected $model = Promocode::class;

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
