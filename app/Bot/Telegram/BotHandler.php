<?php

declare(strict_types=1);

namespace App\Bot\Telegram;

use App\Bot\Telegram\Enums\ChatMessageType;
use App\Bot\Telegram\Enums\OnboardingScenario;
use App\Helpers\StringHelper;
use App\Models\Plan;
use App\Models\Product;
use App\Models\Promocode;
use App\Models\User;
use App\Payment\Enums\PaymentSource;
use App\Payment\Exceptions\PaymentCreationException;
use App\Payment\PaymentService;
use App\Remnawave\DTO\CreateUserRequestDto;
use App\Remnawave\DTO\DeleteUserHwidDeviceRequestDto;
use App\Remnawave\Exceptions\ApiException;
use App\Remnawave\RemnawaveApi;
use App\Repositories\UserRepository;
use App\Services\DeviceLimitEnforcementService;
use App\Services\MessageTemplateService;
use App\Services\PartnerMessageService;
use App\Services\PlanMessageService;
use App\Services\PromocodeService;
use App\Services\Profile\TelegramLinkService;
use Illuminate\Validation\ValidationException;
use App\Services\UserOnboardingService;
use App\Services\UserService;
use App\Services\UserStateManager;
use Carbon\Carbon;
use DefStudio\Telegraph\Handlers\WebhookHandler;
use DefStudio\Telegraph\Keyboard\Button;
use DefStudio\Telegraph\Keyboard\Keyboard;
use Illuminate\Container\Attributes\Config;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Stringable;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class BotHandler extends WebhookHandler
{
    /**
     * Принимает зависимости для работы BotHandler.
     *
     * @param UserRepository $userRepository
     * @param UserService $userService
     * @param UserStateManager $userStateManager
     * @param UserOnboardingService $userOnboardingService
     * @param MessageTemplateService $messageTemplateService
     * @param DeviceLimitEnforcementService $deviceLimitEnforcementService
     * @param PlanMessageService $planMessageService
     * @param PartnerMessageService $partnerMessageService
     * @param PromocodeService $promocodeService
     * @param PaymentService $paymentService
     * @param RemnawaveApi $remnawaveApi
     * @param StringHelper $stringHelper
     * @param TelegramLinkService $telegramLinks
     * @param string $paymentReturnUrl
     */
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly UserService $userService,
        private readonly UserStateManager $userStateManager,
        private readonly UserOnboardingService $userOnboardingService,
        private readonly MessageTemplateService $messageTemplateService,
        private readonly DeviceLimitEnforcementService $deviceLimitEnforcementService,
        private readonly PlanMessageService $planMessageService,
        private readonly PartnerMessageService $partnerMessageService,
        private readonly PromocodeService $promocodeService,
        private readonly PaymentService $paymentService,
        private readonly RemnawaveApi $remnawaveApi,
        private readonly StringHelper $stringHelper,
        private readonly TelegramLinkService $telegramLinks,
        #[Config('yookassa.return_url')]
        private readonly string $paymentReturnUrl,
    ) {
        parent::__construct();
    }

    /**
     * Метод вызывается при вводе начальной команды /start
     *
     * @return void
     *
     * @throws ApiException
     * @throws ConnectionException
     * @throws Throwable
     */
    public function start(): void
    {
        $telegramUser = $this->message->from();
        if (preg_match('/\A\/start(?:@[A-Za-z0-9_]+)?\s+link_(.*)\z/s', $this->message->text() ?? '', $match) === 1) {
            $this->startTelegramLink($match[1]);
            return;
        }

        $referrer = $this->userService->getReferrer($this->message->text() ?? '', $telegramUser->id());

        $user = $this->userRepository->create(
            $telegramUser,
            $referrer?->id,
        );

        if ($user->telegram_merge_id !== null) {
            $this->chat->message('Объединение аккаунтов ещё выполняется. Заверши его в web-профиле.')->send();
            return;
        }
        $remoteUser = null;

        if (! $user->wasRecentlyCreated) {
            $remoteUser = $this->userStateManager->getRemoteUser($user);
            $this->userStateManager->syncFromRemote($user, $remoteUser);
        }

        $scenario = $this->userOnboardingService->resolveScenario(
            $user,
            $remoteUser?->status,
        );

        match ($scenario) {
            OnboardingScenario::Welcome => $this->showWelcome($user, $referrer),
            OnboardingScenario::WelcomeBack => $this->showWelcomeBack($user),
            OnboardingScenario::MainMenu => $this->profile(),
        };
    }

    /**
     * Просит явное согласие в private chat, не создавая второго User или trial.
     *
     * @param string $token
     *
     * @return void
     *
     * @throws Throwable
     */
    private function startTelegramLink(#[\SensitiveParameter] string $token): void
    {
        try {
            $telegram = $this->message?->from();
            if ($telegram === null || $this->request->input('message.chat.type') !== 'private'
                || $telegram->id() !== (int) $this->chat->chat_id || $this->request->boolean('message.from.is_bot')) {
                throw ValidationException::withMessages(['telegram' => 'Привязка доступна только в личном чате с ботом.']);
            }
            $email = $this->telegramLinks->identify($token, $this->bot->id, $telegram);
            $this->chat->html('Привязать этот Telegram к аккаунту <b>' . e($email) . '</b>?'
                . "\n\nПодтверждай только свой аккаунт. Если у тебя уже две подписки, сохраним ссылку более раннего аккаунта и сложим оставшееся оплаченное время.")
                ->keyboard(Keyboard::make()->buttons([
                    Button::make('Подтвердить привязку')->action('linkTelegram')->param('token', $token),
                    Button::make('Отмена')->action('cancelTgLink')->param('token', $token),
                ]))->send();
        } catch (ValidationException $exception) {
            $this->chat->message($exception->validator->errors()->first())->send();
        }
    }

    /**
     * Подтверждает владение Telegram; окончательное объединение выполняется в web.
     *
     * @return void
     */
    public function linkTelegram(): void
    {
        $this->telegramConsent(true);
    }

    /**
     * Отзывает согласие, не затрагивая существующие аккаунты и подписки.
     *
     * @return void
     */
    public function cancelTgLink(): void
    {
        $this->telegramConsent(false);
    }

    /**
     * Проверяет sender callback и принимает одноразовое согласие в том же боте.
     *
     * @param bool $accept
     *
     * @return void
     *
     * @throws Throwable
     */
    private function telegramConsent(bool $accept): void
    {
        try {
            $telegram = $this->callbackQuery?->from();
            if ($telegram === null || $this->request->input('callback_query.message.chat.type') !== 'private'
                || $telegram->id() !== (int) $this->chat->chat_id || $this->request->boolean('callback_query.from.is_bot')) {
                throw ValidationException::withMessages(['telegram' => 'Подтверди привязку в своём личном чате с ботом.']);
            }
            $this->telegramLinks->consent((string) $this->data->get('token'), $this->bot->id, $telegram, $accept);
            $this->chat->message($accept ? 'Telegram подтверждён. Вернись в свой профиль и заверши привязку.' : 'Привязка отменена.')
                ->keyboard(Keyboard::make()->buttons([Button::make('Открыть мой профиль')->url(route('account.profile'))]))->send();
        } catch (ValidationException $exception) {
            $this->chat->message($exception->validator->errors()->first())->send();
        }
    }

    /**
     * Метод отвечает за показ приветственного сообщения
     *
     * @param User $user
     * @param User|null $referrer
     *
     * @return void
     *
     * @throws ApiException
     * @throws ConnectionException
     * @throws Throwable
     */
    private function showWelcome(User $user, ?User $referrer): void
    {
        $userDto = new CreateUserRequestDto(
            username: $user->username,
            expireAt: now()->addDays(3)->utc()->toISOString(),
            trafficLimitBytes: 32212254720, // 30Гб
            tag: 'TRIAL',
            telegramId: $user->chat_id,
            activeInternalSquads: ['4bb28df7-6c1b-4994-8864-52683bb5e144'],
        );

        $remnaUser = $this->remnawaveApi->users()->create($userDto);

        $user->forceFill(['remnawave_user_id' => $remnaUser->response->id])->save();
        $this->userStateManager->markTrial($user);

        if ($referrer) {
            $this->promocodeService->createForRefUser($user);
        }

        $type = $referrer
            ? ChatMessageType::WelcomeRef
            : ChatMessageType::Welcome;

        $message = $this->messageTemplateService->getFormattedMessage(
            $type->value,
            ['referrer_username' => $referrer?->username],
        );

        $this->chat
            ->markdown($message)
            ->keyboard(
                Keyboard::make()->buttons([
                    Button::make('🚀 Начать пользоваться')
                        ->url($remnaUser->response->subscriptionUrl),
                    Button::make('Тарифы')->action('plans'),
                    Button::make('Личный кабинет')->action('profile'),
                    Button::make('Написать в поддержку')->action('help'),
                ]),
            )
            ->send();
    }

    /**
     * Метод отвечает за показ сообщения вернувшемуся пользователю
     *
     * @param User $user
     *
     * @return void
     *
     * @throws Throwable
     */
    private function showWelcomeBack(User $user): void
    {
        $message = $this->messageTemplateService->getFormattedMessage(
            ChatMessageType::WelcomeBack->value,
        );

        $user->update([
            'welcome_back_shown_at' => now(),
        ]);

        $this->promocodeService->createForRefUser($user);

        $this->chat
            ->markdown($message)
            ->keyboard(
                Keyboard::make()->buttons([
                    Button::make('💳 Купить подписку со скидкой')->action('plans'),
                ]),
            )
            ->send();
    }

    /**
     * Метод вызывается при вводе команды /plans
     *
     * @return void
     */
    public function plans(): void
    {
        $plans = Plan::where('status', 'active')->get();
        $user = $this->userRepository->getUserByChatId((int) $this->chat->chat_id);
        $promocode = $user === null
            ? null
            : $this->promocodeService->automaticForUser($user);

        $buttons = [];

        foreach ($plans as $plan) {
            $buttons[] = Button::make("{$plan->short_name}")
                ->action("{$plan->code}");
        }

        $message = $this->planMessageService->plansOverview($promocode);

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
     *
     * @return void
     */
    protected function sendProducts(string $code): void
    {
        $user = $this->userRepository
            ->getUserByChatId($this->callbackQuery->from()->id());
        $promocode = $this->promocodeService->automaticForUser($user);
        $message = $this->planMessageService->planDetails($code, $promocode);

        $plan = Plan::where('code', $code)
            ->with('products')
            ->active()
            ->firstOrFail();

        $buttons = [];

        if ($promocode === null) {
            $buttons[] = Button::make('🎁 У меня есть промокод')
                ->action('promocode')
                ->param('plan', $code);
        }

        foreach ($plan->products as $product) {
            $amount = $promocode === null
                ? $product->price
                : $this->promocodeService->calculatePrice($product->price, $promocode);
            $price = $amount / 100;

            $buttons[] = Button::make("{$product->name} — {$price} ₽")
                ->action('buy')
                ->param('product', $product->id);

            if ($promocode !== null) {
                $buttons[array_key_last($buttons)]->param('promocode', $promocode->id);
            }
        }

        $this->chat
            ->html($message)
            ->keyboard(Keyboard::make()->buttons($buttons))
            ->send();
    }

    /**
     * Метод вызывает при вводе callback /unlimited
     *
     * @return void
     */
    public function unlimited(): void
    {
        $this->sendProducts('unlimited');
    }

    /**
     * Метод вызывается при вводе команды /promocode
     *
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

        if ($this->promocodeService->automaticForUser($user) !== null) {
            $this->sendProducts($planCode);

            return;
        }

        $user->update([
            'state' => 'awaiting_promocode',
            'state_payload' => [
                'plan_code' => $planCode,
            ],
        ]);

        $this->chat->markdown("🎁 Введите промокод ниже")->send();
    }

    /**
     * Обрабатывает ввод промокода, когда пользователь находится в соответствующем состоянии.
     *
     * @param Stringable $text
     *
     * @return void
     *
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
     * Метод обрабатывает событие ввода промокода в чат
     *
     * @param User $user
     *
     * @return void
     *
     * @throws Throwable
     */
    protected function handlePromocodeInput(User $user): void
    {
        $code = trim($this->message->text());

        if ($code === '') {
            return;
        }

        try {
            $promocode = $this->promocodeService->apply($code, $user);

            $planCode = $user->state_payload['plan_code'];

            $plan = Plan::where('code', $planCode)
                ->with('products')
                ->firstOrFail();

            // Сообщение с ценами
            $message = $this->planMessageService
                ->planDetails($planCode, $promocode);

            $buttons = [];

            foreach ($plan->products as $product) {
                $discounted = $this->promocodeService
                    ->calculatePrice($product->price, $promocode);

                $priceRub = (int) round($discounted / 100);

                $buttons[] = Button::make(
                    "{$product->name} — {$priceRub} ₽",
                )
                    ->action('buy')
                    ->param('product', $product->id)
                    ->param('promocode', $promocode->id);
            }

            // Сбрасываем state
            $user->update([
                'state' => null,
                'state_payload' => null,
            ]);

            $this->chat
                ->html($message)
                ->keyboard(Keyboard::make()->buttons($buttons))
                ->send();

        } catch (\DomainException $e) {
            $this->chat
                ->markdown("❌ {$e->getMessage()}\n\nВведите промокод ещё раз.")
                ->send();
        }
    }

    /**
     * Создаёт платёж за выбранный тариф и отправляет кнопку оплаты в Telegram.
     *
     * @param int|string $product
     * @param int|string|null $promocode
     *
     * @return void
     */
    public function buy(int|string $product, int|string|null $promocode = null): void
    {
        $user = $this->userRepository
            ->getUserByChatId($this->callbackQuery->from()->id());
        $selectedProduct = Product::query()
            ->whereKey((int) $product)
            ->where('status', 'active')
            ->first();

        if ($user === null || $selectedProduct === null) {
            $this->chat
                ->markdown('❌ Не удалось определить выбранный тариф. Попробуйте снова.')
                ->keyboard(
                    Keyboard::make()->buttons([
                        Button::make('Выбрать подписку')->action('unlimited'),
                    ]),
                )
                ->send();

            return;
        }

        $selectedPromocode = $promocode === null
            ? null
            : Promocode::query()->find((int) $promocode);

        if ($promocode !== null && $selectedPromocode === null) {
            $this->chat
                ->markdown('❌ Промокод больше недоступен. Выберите тариф повторно.')
                ->keyboard(
                    Keyboard::make()->buttons([
                        Button::make('Выбрать подписку')->action('unlimited'),
                    ]),
                )
                ->send();

            return;
        }

        try {
            $payment = $this->paymentService->createPayment(
                $user,
                $selectedProduct,
                $selectedPromocode,
                PaymentSource::Telegram,
                $this->paymentReturnUrl,
                hash('sha256', 'telegram:' . $this->callbackQuery->id()),
            );

            $this->chat
                ->markdown("💳 Платёж создан.\n\nНажмите кнопку ниже, чтобы перейти к оплате.")
                ->keyboard(
                    Keyboard::make()->buttons([
                        Button::make('Оплатить')->url($payment->confirmation_url),
                    ]),
                )
                ->send();
        } catch (PaymentCreationException $exception) {
            Log::error('Telegram payment creation failed.', [
                'user_id' => $user->id,
                'product_id' => $selectedProduct->id,
                'exception' => $exception::class,
            ]);

            $this->chat
                ->markdown("❌ Сейчас не удалось создать платёж.\n\nПопробуйте ещё раз позже.")
                ->keyboard(
                    Keyboard::make()->buttons([
                        Button::make('Выбрать подписку')->action('unlimited'),
                    ]),
                )
                ->send();
        }
    }

    /**
     * Метод вызывается при вводе команды /profile
     *
     * @return void
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    public function profile(): void
    {
        $user = $this->userRepository->getUserByChatId((int) $this->chat->chat_id);
        $remnaUser = $this->userStateManager->getRemoteUser($user);
        if ($remnaUser->userTraffic->lastConnectedNodeUuid !== null) {
            $remnaNode = $this->remnawaveApi
                ->nodes()
                ->getNodeByUuid($remnaUser->userTraffic->lastConnectedNodeUuid);
            $country = $this->stringHelper->countryName($remnaNode->response->countryCode) ?? '—';
        }
        $expireAt = Carbon::parse($remnaUser->expireAt)
            ->timezone('Europe/Moscow')
            ->format('d.m.Y');
        $traffic = $this->stringHelper->formatTraffic($remnaUser->userTraffic->usedTrafficBytes) ?? '0 Мб';
        $referredUser = $user->referrals()->count() ?? 0;
        $referredBonus = $user->receivedReferralRewards()->sum('days_added');
        $userDevices = $this->remnawaveApi->hwid()->getUserHwidDevices($remnaUser->id);
        $subscriptionUrl = $remnaUser->subscriptionUrl;

        $message = "👤 *Личный кабинет пользователя*";
        $message .= "\n\n• ID: `{$user->chat_id}`";
        $message .= "\n• Username: @{$user->username}";
        $message .= "\n\n🌍 *Ваша подписка:*";

        if (! $this->stringHelper->isSubscriptionActive($remnaUser->expireAt)) {
            $message .= "\nНет активных подписок";
        }

        if ($remnaUser->userTraffic->lastConnectedNodeUuid === null) {
            $message .= "\n\nВы еще не использовали свою подписку";
        }

        if ($remnaUser->userTraffic->lastConnectedNodeUuid !== null) {
            $message .= "\nЗавершается: *{$expireAt}*";
            $message .= "\nИспользовано трафика: *{$traffic}*";
            $message .= "\n\nСтрана: *{$country}*";
        }

        $message .= "\n\n📱 *Устройства:*";
        $message .= "\n\nПодключенные устройства: *{$userDevices->response->total}*";
        $message .= "\n\n🤝 *Партнерская программа:*";
        $message .= "\n\nПриглашенных пользователей: *{$referredUser}*";
        $message .= "\nПолученных бонусов: *{$referredBonus} дней*";

        $this->chat->markdown($message)
            ->keyboard(Keyboard::make()
                ->buttons([
                    Button::make('Страница подписки')->url($subscriptionUrl),
                    Button::make('Управление устройствами')->action('devices'),
                    Button::make('Партнерская программа')->action('partners'),
                    Button::make('Тарифы')->action('plans'),
                    Button::make('Служба поддержки')->action('help'),
                ]))
            ->send();
    }

    /**
     * Метод вызывается при вводе команды /devices
     *
     * @return void
     *
     * @throws ApiException
     * @throws ConnectionException
     */
    public function devices(): void
    {
        $user = $this->userRepository->getUserByChatId((int) $this->chat->chat_id);
        $remnaUser = $this->userStateManager->getRemoteUser($user);
        $devices = $this->remnawaveApi->hwid()->getUserHwidDevices($remnaUser->id);
        $userDevices = $devices->response->devices ?? [];

        if (empty($userDevices)) {
            $this->chat->markdown("У вас нет зарегистрированных устройств.")
                ->send();
            return;
        }

        $buttons = [];
        $deviceListText = "";

        foreach ($userDevices as $index => $device) {
            $label = sprintf(
                "%s | %s",
                $device->platform,
                $device->deviceModel,
            );

            $deviceListText .= ($index + 1) . ". {$label}\n";

            $buttons[] = Button::make("❌ {$label}")
                ->action('deleteDevice')
                ->param('hwid', $device->hwid);
        }

        $message = "📱 *Ваши устройства:*\n\n";
        $message .= $deviceListText;
        $message .= "\n";
        $message .= "Нажмите на устройство для удаления.\n\n";

        $this->chat->markdown($message)
            ->keyboard(
                Keyboard::make()->buttons($buttons),
            )
            ->send();
    }

    /**
     * Метод отвечает за удаление устройства из подписки
     *
     * @return void
     *
     * @throws ApiException
     * @throws ConnectionException
     * @throws Throwable
     */
    public function deleteDevice(): void
    {
        $hwid = $this->data->get('hwid');
        $user = $this->userRepository->getUserByChatId((int) $this->chat->chat_id);
        $remnaUser = $this->userStateManager->getRemoteUser($user);
        $dto = new DeleteUserHwidDeviceRequestDto(
            userId: $remnaUser->id,
            hwid: $hwid,
        );
        $devices = $this->remnawaveApi->hwid()->deleteUserHwidDevices($dto);

        $this->deviceLimitEnforcementService->recoverAfterDeviceRemoval(
            $user,
            $remnaUser,
            $devices->response->total,
        );

        $this->chat->markdown("✅ Устройство удалено.")->send();

        $this->devices();
    }

    /**
     * Метод вызывается при вводе команды /partners
     *
     * @return void
     */
    public function partners(): void
    {
        $chatId = (int) $this->chat->chat_id;

        $user = $this->userRepository->getUserByChatId($chatId);

        $message = $this->partnerMessageService->overview(
            partnerLink: $this->userService->generatePartnerLink($chatId),
            referredUsers: $user->referrals()->count(),
            referredBonusDays: $user->receivedReferralRewards()->where('status', \App\Enums\ReferralRewardStatus::Applied)->sum('days_added'),
        );

        $this->chat
            ->markdown($message)
            ->keyboard(
                Keyboard::make()
                    ->buttons([
                        Button::make('Расширенная статистика')
                            ->action('advanced'),
                    ]),
            )
            ->send();
    }

    /**
     * Метод вызывается при вводе команды /advanced
     *
     * @return void
     */
    public function advanced(): void
    {
        $user = $this->userRepository->getUserByChatId((int) $this->chat->chat_id);
        $referrals = $user->referrals()->select('id', 'username', 'tags')->get();

        $message = "🧩 *Расширенная статистика*\n\n";
        $message .= "Приглашенные пользователи:\n\n";

        if ($referrals->isEmpty()) {
            $message .= "Пока никто не приглашён";
        } else {
            foreach ($referrals as $index => $refUser) {
                $username = '@' . $refUser->username;
                $statusLabel = $refUser->tags->label();

                $message .= ($index + 1) . ". {$username} — {$statusLabel}\n";
            }
        }

        $this->chat->markdown($message)->send();
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
                    Button::make('Написать в поддержку')->url('https://t.me/hey_dude_web'),
                ]))
            ->send();
    }

    /**
     * Метод вызывается в случае падения вебхука и ошибки 500
     *
     * @param Throwable $throwable
     *
     * @return void
     *
     * @throws Throwable
     */
    protected function onFailure(Throwable $throwable): void
    {
        if ($throwable instanceof NotFoundHttpException) {
            throw $throwable;
        }

        report($throwable);

        $this->reply('Извините, произошла ошибка. Попробуйте совершить попытку позже или напишите в поддержку.');
    }
}
