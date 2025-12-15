<?php

declare(strict_types=1);

namespace App\Bot\Telegram;

use App\Helpers\StringHelper;
use App\Remnawave\DTO\CreateUserRequestDto;
use App\Remnawave\Exceptions\ApiException;
use App\Remnawave\RemnawaveApi;
use App\Repositories\ReferralRewardRepository;
use App\Repositories\UserRepository;
use Carbon\Carbon;
use DefStudio\Telegraph\Handlers\WebhookHandler;
use DefStudio\Telegraph\Keyboard\Button;
use DefStudio\Telegraph\Keyboard\Keyboard;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class BotHandler extends WebhookHandler
{
    /**
     * @param UserRepository $userRepository
     * @param ReferralRewardRepository $referralRewardRepository
     * @param RemnawaveApi $remnawaveApi
     * @param StringHelper $stringHelper
     */
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly ReferralRewardRepository $referralRewardRepository,
        private readonly RemnawaveApi $remnawaveApi,
        private readonly StringHelper $stringHelper,
    ) {
        parent::__construct();
    }

    /**
     * Метод вызывается при вводе начальной команды /start
     *
     * @return void
     * @throws Exception
     */
    public function start(): void
    {
        $telegramUser = $this->message->from();
        $chatId = $telegramUser->id();

        $existingUser = $this->userRepository->getUserByChatId($chatId);

        $referrerChatId = $this->userRepository
            ->getReferrerChatId($this->message->text() ?? '');

        $referrerUser = null;

        if ($referrerChatId) {
            $referrerUser = $this->userRepository
                ->getUserByChatId($referrerChatId);
        }

        // Пользователь уже существует
        if ($existingUser) {
            $user = $this->userRepository->create($telegramUser, $referrerUser);

            $message = "✨ *С возвращением, {$user->first_name}!*";
            $message .= "\n\nРад что вы решили воспользоваться сервисом еще раз.";
            $message .= "\n\n🎁 В знак возвращения дарю вам скидку на оплату любого тарифа в размере -30%.";

            $this->chat
                ->markdown($message)
                ->keyboard(Keyboard::make()
                    ->buttons([
                        Button::make('💳 Купить подписку')->action('plans'),
                    ]))->send();

            return;
        }

        // Новый или приглашенный пользователь
        try {
            $newUser = $this->userRepository->create(
                $telegramUser,
                $referrerUser?->id,
            );

            $remnaUser = new CreateUserRequestDto(
                username: 'kiipod2',
                expireAt: now()->addDays(3)->utc()->toISOString(),
                trafficLimitBytes: 32212254720, // 30Гб
                telegramId: $newUser->chat_id,
                activeInternalSquads: ['508166c3-bd06-4dca-bc8c-1402c196dee8'],
            );

            $remnaUserSub = $this->remnawaveApi->users()->create($remnaUser);

            $message = "*Привет, {$newUser->first_name}!* 👋";

            if (!$referrerUser) {
                $message .= "\n\nПрямо сейчас вам доступна бесплатная пробная версия на 3 дня.";
                $message .= "\n\nНа странице подписки вы найдете приложения при помощи которых сможешь подключиться + инструкцию.";
                $message .= "\n\nНажмите на кнопку ниже чтобы подключиться 👇";
            }

            // Сообщение для реферала
            if ($referrerUser) {
                $message .= "\n\nВы были приглашены пользователем *@{$referrerUser->username}.*";
                $message .= "\n\n🎁 Это значит что вы получаете скидку на первую покупку любого из тарифов в размере -30%.";
                $message .= "\n\nА еще прямо сейчас вам доступна бесплатная пробная версия на 3 дня.";
                $message .= "\n\nНа странице подписки вы найдете приложения при помощи которых сможешь подключиться + инструкцию.";
                $message .= "\n\nНажмите на кнопку ниже чтобы подключиться 👇";
            }

            $this->chat->markdown($message)
                ->keyboard(Keyboard::make()
                ->buttons([
                    Button::make('🚀 Начать пользоваться')->url($remnaUserSub->response->subscriptionUrl),
                ]))
                ->send();

        } catch (\Exception $e) {
            $this->chat
                ->markdown("❌ Произошла ошибка при регистрации. Сообщите об этом в службу поддержки.")
                ->keyboard(Keyboard::make()
                    ->buttons([
                        Button::make('Написать в поддержку')->url('https://t.me/dudeweb_group'),
                    ]))
                ->send();
        }
    }

    /**
     * Метод вызывается при вводе команды /plans
     *
     * @return void
     */
    public function plans(): void
    {
        $message = "В *dudeweb* два тарифа для доступа к сервису.";
        $message .= "\n\n✅ Лимитный тариф включают в себя *50Гб трафика* каждый месяц.";
        $message .= "\n✅ Безлимитный тариф *без ограничения* по ежемесячному трафику.";
        $message .= "\n\n*Стоимость:*";
        $message .= "\n💰 Лимитный: от 199 ₽/месяц";
        $message .= "\n💰 Безлимитный: от 399 ₽/месяц";
        $message .= "\n\n⚠️️ Без автосписаний и привязки карт.";

        $this->chat->markdown($message)
            ->keyboard(Keyboard::make()
                ->buttons([
                    Button::make('Лимитный')->action('limit'),
                    Button::make('Безлимитный')->action('unlimited'),
                ]))
            ->send();
    }

    /**
     * Метод вызывает при вводе callback /limit
     *
     * @return void
     */
    public function limit(): void
    {
        $message = "*Лимитный тариф.*";
        $message .= "\n\n*Что вы получите:*";
        $message .= "\n• Трафик 50Гб/месяц";
        $message .= "\n• Доступ ко всем локациям";
        $message .= "\n• Шифрование трафика";
        $message .= "\n\n*Тарифы:*";
        $message .= "\n1 месяц ➜ 199 ₽";
        $message .= "\n3 месяца ➜ 499 ₽";
        $message .= "\n6 месяцев + 1 в подарок 🎁 ➜ 999 ₽";
        $message .= "\n12 месяцев + 3 в подарок 🎁 ➜ 1990 ₽";
        $message .= "\n\n*Выберите свой!*";

        $this->chat->markdown($message)
            ->keyboard(Keyboard::make()
                ->buttons([
                    Button::make('У меня есть промокод')->action('promocode'),
                    Button::make('1 месяц - 199 ₽')->action('1month'),
                    Button::make('3 месяца - 499 ₽')->action('3months'),
                    Button::make('6 + 1 месяцев - 999 ₽')->action('6months'),
                    Button::make('12 + 3 месяцев - 1990 ₽')->action('12months'),
                ]))
            ->send();
    }

    /**
     * Метод вызывает при вводе callback /unlimited
     *
     * @return void
     */
    public function unlimited(): void
    {
        $message = "*Безлимитный тариф.*";
        $message .= "\n\n*Что вы получите:*";
        $message .= "\n• Трафик без ограничений";
        $message .= "\n• Доступ ко всем локациям";
        $message .= "\n• Шифрование трафика";
        $message .= "\n\n*Тарифы:*";
        $message .= "\n1 месяц ➜ 399 ₽";
        $message .= "\n3 месяца ➜ 1197 ₽";
        $message .= "\n6 месяцев + 1 в подарок 🎁 ➜ 1999 ₽";
        $message .= "\n12 месяцев + 3 в подарок 🎁 ➜ 1990 ₽";
        $message .= "\n\n*Выберите свой!*";

        $this->chat->markdown($message)
            ->keyboard(Keyboard::make()
                ->buttons([
                    Button::make('У меня есть промокод')->action('promocode'),
                    Button::make('1 месяц - 399 ₽')->action('1month'),
                    Button::make('3 месяца - 1197 ₽')->action('3months'),
                    Button::make('6 + 1 месяцев - 1999 ₽')->action('6months'),
                    Button::make('12 + 3 месяцев - 3990 ₽')->action('12months'),
                ]))
            ->send();
    }

    /**
     * Метод вызывается при вводе команды /profile
     *
     * @return void
     * @throws ApiException
     * @throws ConnectionException
     */
    public function profile(): void
    {
        $user = $this->userRepository->getUserByChatId($this->message->from()->id());
        $remnaUser = $this->remnawaveApi->users()->getUserByUsername($this->message->from()->username());
        $remnaNode = $this->remnawaveApi->nodes()->getNodeByUuid($remnaUser->response->userTraffic->lastConnectedNodeUuid);
        $country = $this->stringHelper->countryName($remnaNode->response->countryCode) ?? '—';
        $expireAt = Carbon::parse($remnaUser->response->expireAt)
            ->timezone('Europe/Moscow')
            ->format('d.m.Y');
        $traffic = $this->stringHelper->formatTraffic($remnaUser->response->userTraffic->usedTrafficBytes) ?? '0 Мб';
        $referredUser = $user->referrals()->count() ?? 0;
        $referredBonus = $user->receivedReferralRewards()->count() ?? 0;

        $message = "👤 *Личный кабинет пользователя.*";
        $message .= "\n\n• ID: `{$user->chat_id}`";
        $message .= "\n• Имя: {$user->first_name}";
        $message .= "\n• Username: @{$user->username}";
        $message .= "\n\n---";
        $message .= "\n\n🌍 *Ваша подписка:*";

        if (! $this->stringHelper->isSubscriptionActive($remnaUser->response->expireAt)) {
            $message .= "\nНет активных подписок";
        }

        $message .= "\n\nСтрана: *{$country}*";
        $message .= "\nЗавершается: *{$expireAt}*";
        $message .= "\nИспользовано трафика: *{$traffic}*";
        $message .= "\n\n---";
        $message .= "\n\n🤝 *Партнерская программа:*";
        $message .= "\n\nПриглашенных пользователей: *{$referredUser}*";
        $message .= "\nПолученных бонусов: *{$referredBonus} дней*";

        $this->chat->markdown($message)
            ->keyboard(Keyboard::make()
                ->buttons([
                    Button::make('Партнерская программа')->action('partners'),
                    Button::make('Продлить подписку')->action('plans'),
                ]))
            ->send();
    }

    /**
     * Метод вызывается при вводе команды /help
     *
     * @return void
     */
    public function help(): void
    {
        $message = "💬 Если у вас появились вопросы и сложности по работоспособности сервиса, то напишите в службу поддержки.";
        $message .= "\n\n🧩 А так же прочтите топик *Trouble* в нашей группе, там разобрали основные проблемы и пути их решения.";

        $this->chat->markdown($message)
            ->keyboard(Keyboard::make()
                ->buttons([
                    Button::make('Написать в поддержку')->url('https://t.me/dudeweb_group'),
                ]))
            ->send();
    }

    /**
     * Метод вызывается в случае падения вебхука и ошибки 500
     *
     * @param Throwable $throwable
     * @return void
     * @throws Throwable
     */
    protected function onFailure(Throwable $throwable): void
    {
        if ($throwable instanceof NotFoundHttpException) {
            throw $throwable;
        }

        report($throwable);

        $this->reply('Извините, произошла ошибка. Сервер временно не доступен.');
    }
}
