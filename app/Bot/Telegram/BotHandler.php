<?php

declare(strict_types=1);

namespace App\Bot\Telegram;

use App\Helpers\StringHelper;
use App\Models\Plan;
use App\Models\User;
use App\Remnawave\DTO\CreateUserRequestDto;
use App\Remnawave\Exceptions\ApiException;
use App\Remnawave\RemnawaveApi;
use App\Repositories\UserRepository;
use App\Services\MessageTemplateService;
use App\Services\PlanMessageService;
use App\Services\PromocodeService;
use Carbon\Carbon;
use DefStudio\Telegraph\Handlers\WebhookHandler;
use DefStudio\Telegraph\Keyboard\Button;
use DefStudio\Telegraph\Keyboard\Keyboard;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;
use Illuminate\Support\Stringable;

class BotHandler extends WebhookHandler
{
    /**
     * @param UserRepository $userRepository
     * @param MessageTemplateService $messageTemplateService
     * @param PlanMessageService $planMessageService
     * @param PromocodeService $promocodeService
     * @param RemnawaveApi $remnawaveApi
     * @param StringHelper $stringHelper
     */
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly MessageTemplateService $messageTemplateService,
        private readonly PlanMessageService $planMessageService,
        private readonly PromocodeService $promocodeService,
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

        $referrerUser = $referrerChatId
            ? $this->userRepository->getUserByChatId($referrerChatId)
            : null;

        // СЦЕНАРИЙ: пользователь существует
        if ($existingUser) {
            $user = $this->userRepository->create($telegramUser, $referrerUser);

            $message = $this->messageTemplateService->getFormattedMessage(
                ChatMessageType::WelcomeBack->value,
                [
                    'first_name' => $user->first_name,
                ],
            );

            $this->chat
                ->markdown($message)
                ->keyboard(
                    Keyboard::make()->buttons([
                        Button::make('💳 Купить подписку')->action('plans'),
                    ]),
                )
                ->send();

            return;
        }

        // СЦЕНАРИЙ: новый пользователь или приглашенный
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

            $subscription = $this->remnawaveApi->users()->create($remnaUser);

            // Выбор шаблона
            $messageType = $referrerUser
                ? ChatMessageType::WelcomeRef
                : ChatMessageType::Welcome;

            $message = $this->messageTemplateService->getFormattedMessage(
                $messageType->value,
                [
                    'first_name' => $newUser->first_name,
                    'referrer_username' => $referrerUser?->username,
                ],
            );

            $this->chat
                ->markdown($message)
                ->keyboard(
                    Keyboard::make()->buttons([
                        Button::make('🚀 Начать пользоваться')
                            ->url($subscription->response->subscriptionUrl),
                    ]),
                )
                ->send();

        } catch (\Throwable $e) {
            report($e);

            $this->chat
                ->markdown('❌ Произошла ошибка при регистрации. Сообщите об этом в службу поддержки.')
                ->keyboard(
                    Keyboard::make()->buttons([
                        Button::make('Написать в поддержку')
                            ->url('https://t.me/dudeweb_group'),
                    ]),
                )
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
        $plans = Plan::where('status', 'active')->get();

        $buttons = [];

        foreach ($plans as $plan) {
            $buttons[] = Button::make("{$plan->short_name}")
                ->action("{$plan->code}");
        }

        $message = $this->planMessageService->plansOverview();

        $this->chat->markdown($message)
            ->keyboard(
                Keyboard::make()->buttons($buttons),
            )
            ->send();
    }

    /**
     * Метод возвращает сообщения для выбранных тарифов
     *
     * @param string $code
     * @return void
     */
    protected function sendPlan(string $code): void
    {
        $message = $this->planMessageService->planDetails($code);

        $plan = Plan::where('code', $code)
            ->with('products')
            ->active()
            ->firstOrFail();

        $buttons = [
            Button::make('🎁 У меня есть промокод')
                ->action("promocode;plan:{$code}"),
        ];

        foreach ($plan->products as $product) {
            $price = $product->price / 100;

            $buttons[] = Button::make("{$product->name} - {$price} ₽")
                ->action("buy:{$product->id}");
        }

        $this->chat
            ->markdown($message)
            ->keyboard(Keyboard::make()->buttons($buttons))
            ->send();
    }

    /**
     * Метод вызывает при вводе callback /limit
     *
     * @return void
     */
    public function limited(): void
    {
        $this->sendPlan('limited');
    }

    /**
     * Метод вызывает при вводе callback /unlimited
     *
     * @return void
     */
    public function unlimited(): void
    {
        $this->sendPlan('unlimited');
    }

    /**
     * @return void
     */
    public function promocode(): void
    {
        $user = $this->userRepository
            ->getUserByChatId($this->callbackQuery->from()->id());

        $planCode = $this->data->get('plan');

        if (!$planCode) {
            $this->chat
                ->markdown('❌ Не удалось определить тариф. Попробуйте снова.')
                ->send();
            return;
        }

        $user->update([
            'state' => 'awaiting_promocode',
            'state_payload' => [
                'plan_code' => $planCode,
            ],
        ]);

        $this->chat
            ->markdown("🎁 Введите промокод ниже")
            ->send();
    }

    /**
     * @param User $user
     * @return void
     * @throws Throwable
     */
    protected function handlePromocodeInput(User $user): void
    {
        $code = trim((string) $this->message->text());

        if ($code === '') {
            return;
        }

        try {
            $promocode = $this->promocodeService->apply($code, $user);

            $planCode = $user->state_payload['plan_code'];

            $message = $this->planMessageService
                ->planDetails($planCode, $promocode);

            $user->update([
                'state' => null,
                'state_payload' => null,
            ]);

            $this->chat
                ->markdown($message)
                ->send();

        } catch (\DomainException $e) {
            $this->chat
                ->markdown("❌ {$e->getMessage()}\n\nВведите промокод ещё раз.")
                ->send();
        }
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
        $remnaUser = $this->remnawaveApi->users()->getUserByUsername('kiipod2');
        if ($remnaUser->response->userTraffic->lastConnectedNodeUuid !== null) {
            $remnaNode = $this->remnawaveApi->nodes()->getNodeByUuid($remnaUser->response->userTraffic->lastConnectedNodeUuid);
            $country = $this->stringHelper->countryName($remnaNode->response->countryCode) ?? '—';
        }
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

        if ($remnaUser->response->userTraffic->lastConnectedNodeUuid === null) {
            $message .= "\n\nВы еще не использовали свою подписку";
        }

        if ($remnaUser->response->userTraffic->lastConnectedNodeUuid !== null) {
            $message .= "\n\nСтрана: *{$country}*";
            $message .= "\nЗавершается: *{$expireAt}*";
            $message .= "\nИспользовано трафика: *{$traffic}*";
        }
        $message .= "\n\n---";
        $message .= "\n\n🤝 *Партнерская программа:*";
        $message .= "\n\nПриглашенных пользователей: *{$referredUser}*";
        $message .= "\nПолученных бонусов: *{$referredBonus} дней*";

        $this->chat->markdown($message)
            ->keyboard(Keyboard::make()
                ->buttons([
                    //Button::make('Партнерская программа')->action('partners'),
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
        $message = $this->messageTemplateService->getFormattedMessage(
            ChatMessageType::Help->value,
        );

        $this->chat->markdown($message)
            ->keyboard(Keyboard::make()
                ->buttons([
                    Button::make('Написать в поддержку')->url('https://t.me/dudeweb_group'),
                ]))
            ->send();
    }

    /**
     * @param Stringable $text
     * @return void
     * @throws Throwable
     */
    protected function handleChatMessage(Stringable $text): void
    {
        $user = $this->userRepository
            ->getUserByChatId($this->message->from()->id());

        if ($user?->state === 'awaiting_promocode') {
            $this->handlePromocodeInput($user);
        }
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
