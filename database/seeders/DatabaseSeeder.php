<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Ramsey\Uuid\Uuid;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Создаем категории
        $limitedCategory = Category::create([
            'id' => Uuid::uuid4()->toString(),
            'name' => 'Лимитный',
            'code' => 'limited',
        ]);

        $unlimitedCategory = Category::create([
            'id' => Uuid::uuid4()->toString(),
            'name' => 'Безлимитный',
            'code' => 'unlimited',
        ]);

        // Лимитные продукты
        $limitedPrices = [
            ['name' => '1 месяц', 'price' => 19900],
            ['name' => '3 месяца', 'price' => 49900],
            ['name' => '6 месяцев', 'price' => 99900],
            ['name' => '12 месяцев', 'price' => 199000],
        ];

        foreach ($limitedPrices as $price) {
            Product::create([
                'id' => Uuid::uuid4()->toString(),
                'category_id' => $limitedCategory->id,
                'name' => $price['name'],
                'price' => $price['price'],
                'status' => 'active',
            ]);
        }

        // Безлимитные продукты
        $unlimitedPrices = [
            ['name' => '1 месяц', 'price' => 39900],
            ['name' => '3 месяца', 'price' => 119700],
            ['name' => '6 месяцев', 'price' => 199900],
            ['name' => '12 месяцев', 'price' => 399000],
        ];

        foreach ($unlimitedPrices as $price) {
            Product::create([
                'id' => Uuid::uuid4()->toString(),
                'category_id' => $unlimitedCategory->id,
                'name' => $price['name'],
                'price' => $price['price'],
                'status' => 'active',
            ]);
        }
    }
}
