<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Advantage;
use App\Models\ChatMessage;
use App\Models\Plan;
use App\Models\PlanAdvantage;
use App\Models\Product;
use App\Models\Promocode;
use App\Models\ReferralBonus;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Тарифы
        $unlimitedPlan = Plan::create([
            'name' => 'Безлимитный тариф',
            'short_name' => 'Безлимитный',
            'code' => 'unlimited',
            'description' => 'без ограничения по ежемесячному трафику.',
            'device_limit' => 5,
            'status' => 'active',
        ]);

        // Создаем преимущества
        $advantages = [
            // Для лимитного тарифа
            ['title' => '5 устройств в подписке'],
            ['title' => 'Трафик без ограничений'],
            ['title' => 'Безопасность ваших данных в интернете'],
            ['title' => 'Скорость соединения до 1Гб'],
            ['title' => 'Отсутствие логов'],
        ];

        $createdAdvantages = [];
        foreach ($advantages as $advantage) {
            $adv = Advantage::create([
                'title' => $advantage['title'],
            ]);
            $createdAdvantages[$advantage['title']] = $adv->id;
        }

        // Привязываем преимущества к безлимитному тарифу
        $unlimitedAdvantages = [
            'Трафик без ограничений',
            '5 устройств в подписке',
            'Безопасность ваших данных в интернете',
            'Скорость соединения до 1Гб',
            'Отсутствие логов',
        ];

        foreach ($unlimitedAdvantages as $advantageTitle) {
            if (isset($createdAdvantages[$advantageTitle])) {
                PlanAdvantage::create([
                    'plan_id' => $unlimitedPlan->id,
                    'advantage_id' => $createdAdvantages[$advantageTitle],
                ]);
            }
        }

        // Безлимитные продукты
        $unlimitedPrices = [
            ['name' => '1 месяц', 'price' => 20000],
            ['name' => '3 месяца', 'price' => 60000],
            ['name' => '6 месяцев', 'price' => 100000],
            ['name' => '12 месяцев', 'price' => 200000],
        ];

        foreach ($unlimitedPrices as $price) {
            Product::create([
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
                'text' => "Привет! 👋\n\nРад вас видеть в нашем коммьюнити.\n\nВам доступна бесплатная пробная версия на 3 дня.\n\nНа странице подписки вы найдете инструкцию по подключению и скачаете приложение.",
                'placeholders' => null,
                'status' => 'active',
                'sent_at' => null,
            ],
            [
                'type' => 'welcome_back',
                'text' => "✨ *С возвращением!*\n\nРад что вы решили воспользоваться сервисом еще раз.\n\n🎁 В знак возвращения дарю вам скидку на оплату любого тарифа в размере -30%.",
                'placeholders' => null,
                'status' => 'active',
                'sent_at' => null,
            ],
            [
                'type' => 'welcome_ref',
                'text' => "Привет! 👋\n\nВы были приглашены пользователем *@{referrer_username}.*\n\n🎁 Вы получаете скидку на первую покупку любого из тарифов в размере -30%.\n\nА еще прямо сейчас вам доступна бесплатная пробная версия на 3 дня.\n\nНа странице подписки вы найдете инструкцию по подключению и скачаете приложение.",
                'placeholders' => ['referrer_username'],
                'status' => 'active',
                'sent_at' => null,
            ],
            [
                'type' => 'help',
                'text' => "💬 Если у вас появились вопросы и сложности по работоспособности сервиса, то напишите в службу поддержки.",
                'placeholders' => null,
                'status' => 'active',
                'sent_at' => null,
            ],
            [
                'type' => 'plans',
                'text' => "Сейчас в *dudeweb* есть великолепный тариф для доступа к сервису.",
                'placeholders' => null,
                'status' => 'active',
                'sent_at' => null,
            ],
            [
                'type' => 'partners',
                'text' => "🤝 *Партнерская программа*\n\n"
                    . "Условия для участия простые:\n\n"
                    . "1. Вы приглашаете друга\n"
                    . "2. Друг получает бонус на *первую покупку подписки в размере 30%*\n"
                    . "3. Каждый раз когда друг оплачивает подписку\n"
                    . "4. Вы получаете *бонус*:\n\n"
                    . "{referral_bonus}\n\n"
                    . "🔗 *Ваша партнерская ссылка для друзей*:\n\n"
                    . "`{partner_link}`\n\n"
                    . "📊 *Ваша статистика:*\n\n"
                    . "Приглашенных пользователей: *{referred_users}*\n"
                    . "Полученных бонусов: *{referred_bonus_days} дней*",
                'placeholders' => [
                    'referral_bonus',
                    'partner_link',
                    'referred_users',
                    'referred_bonus_days',
                ],
                'status' => 'active',
                'sent_at' => null,
            ],
        ];

        foreach ($messages as $message) {
            ChatMessage::create([
                'type' => $message['type'],
                'text' => $message['text'],
                'placeholders' => $message['placeholders'],
                'status' => $message['status'],
                'sent_at' => $message['sent_at'],
            ]);
        }

        // Промокод
        Promocode::create([
            'title' => 'happy',
            'type' => 'percent',
            'discount_value' => 30,
            'count' => 3,
        ]);

        // Бонусные вознаграждения
        $bonuses = [
            ['paid_months' => 1,  'bonus_days' => 7],
            ['paid_months' => 3,  'bonus_days' => 14],
            ['paid_months' => 6,  'bonus_days' => 21],
            ['paid_months' => 12, 'bonus_days' => 30],
        ];

        foreach ($bonuses as $bonus) {
            ReferralBonus::create([
                'paid_months' => $bonus['paid_months'],
                'bonus_days' => $bonus['bonus_days'],
            ]);
        }
    }
}
