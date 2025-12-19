<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Advantage;
use App\Models\ChatMessage;
use App\Models\Plan;
use App\Models\PlanAdvantage;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Ramsey\Uuid\Uuid;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Создаем категории
        $limitedPlan = Plan::create([
            'id' => Uuid::uuid4()->toString(),
            'name' => 'Лимитный тариф',
            'short_name' => 'Лимитный',
            'code' => 'limited',
            'description' => 'Лимитный тариф включают в себя 50Гб трафика каждый месяц.',
        ]);

        $unlimitedPlan = Plan::create([
            'id' => Uuid::uuid4()->toString(),
            'name' => 'Безлимитный тариф',
            'short_name' => 'Безлимитный',
            'code' => 'unlimited',
            'description' => 'Безлимитный тариф без ограничения по ежемесячному трафику.',
        ]);

        // Создаем преимущества
        $advantages = [
            // Для лимитного тарифа
            ['title' => 'Трафик 50Гб/месяц'],
            ['title' => 'Трафик без ограничений'],
            ['title' => 'Доступ ко всем локациям'],
            ['title' => 'Надежное шифрование'],
            ['title' => 'Безопасность ваших данных в интернете'],
            ['title' => 'Скорость соединения до 1Гб'],
            ['title' => 'Отсутствие логов'],
        ];

        $createdAdvantages = [];
        foreach ($advantages as $advantage) {
            $adv = Advantage::create([
                'id' => Uuid::uuid4()->toString(),
                'title' => $advantage['title'],
            ]);
            $createdAdvantages[$advantage['title']] = $adv->id;
        }

        $limitedAdvantages = [
            'Трафик 50Гб/месяц',
            'Доступ ко всем локациям',
            'Надежное шифрование',
            'Безопасность ваших данных в интернете',
            'Скорость соединения до 1Гб',
            'Отсутствие логов',
        ];

        foreach ($limitedAdvantages as $advantageTitle) {
            if (isset($createdAdvantages[$advantageTitle])) {
                PlanAdvantage::create([
                    'id' => Uuid::uuid4()->toString(),
                    'plan_id' => $limitedPlan->id,
                    'advantage_id' => $createdAdvantages[$advantageTitle],
                ]);
            }
        }

        // Привязываем преимущества к безлимитному тарифу
        $unlimitedAdvantages = [
            'Трафик без ограничений',
            'Доступ ко всем локациям',
            'Надежное шифрование',
            'Безопасность ваших данных в интернете',
            'Скорость соединения до 1Гб',
            'Отсутствие логов',
        ];

        foreach ($unlimitedAdvantages as $advantageTitle) {
            if (isset($createdAdvantages[$advantageTitle])) {
                PlanAdvantage::create([
                    'id' => Uuid::uuid4()->toString(),
                    'plan_id' => $unlimitedPlan->id,
                    'advantage_id' => $createdAdvantages[$advantageTitle],
                ]);
            }
        }

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
                'plan_id' => $limitedPlan->id,
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
                'plan_id' => $unlimitedPlan->id,
                'name' => $price['name'],
                'price' => $price['price'],
                'status' => 'active',
            ]);
        }

        // Сообщения
        $messages = [
            [
                'type' => 'welcome',
                'text' => "Привет, {first_name}! 👋\n\nПрямо сейчас вам доступна бесплатная пробная версия на 3 дня.\n\nНа странице подписки вы найдете приложения при помощи которых сможешь подключиться + инструкцию.\n\nНажмите на кнопку ниже чтобы подключиться 👇",
                'placeholders' => ['first_name'],
                'status' => 'active',
                'sent_at' => null,
            ],
            [
                'type' => 'welcome_back',
                'text' => "✨ *С возвращением, {first_name}!*\n\nРад что вы решили воспользоваться сервисом еще раз.\n\n🎁 В знак возвращения дарю вам скидку на оплату любого тарифа в размере -30%.",
                'placeholders' => ['first_name'],
                'status' => 'active',
                'sent_at' => null,
            ],
            [
                'type' => 'welcome_ref',
                'text' => "Привет, {first_name}! 👋\n\nВы были приглашены пользователем *@{referrer_username}.*\n\n🎁 Это значит что вы получаете скидку на первую покупку любого из тарифов в размере -30%.\n\nА еще прямо сейчас вам доступна бесплатная пробная версия на 3 дня.\n\nНа странице подписки вы найдете приложения при помощи которых сможешь подключиться + инструкцию.\n\nНажмите на кнопку ниже чтобы подключиться 👇",
                'placeholders' => ['first_name', 'referrer_username'],
                'status' => 'active',
                'sent_at' => null,
            ],
            [
                'type' => 'help',
                'text' => "💬 Если у вас появились вопросы и сложности по работоспособности сервиса, то напишите в службу поддержки.\n\n🧩 А так же прочтите топик Trouble в нашей группе, там разобрали основные проблемы и пути их решения.",
                'placeholders' => null,
                'status' => 'active',
                'sent_at' => null,
            ],
        ];

        foreach ($messages as $message) {
            ChatMessage::create([
                'id' => Uuid::uuid4()->toString(),
                'type' => $message['type'],
                'text' => $message['text'],
                'placeholders' => $message['placeholders'],
                'status' => $message['status'],
                'sent_at' => $message['sent_at'],
            ]);
        }
    }
}
