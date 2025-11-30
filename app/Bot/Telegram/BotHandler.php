<?php

declare(strict_types=1);

namespace App\Bot\Telegram;

use App\Models\User;
use App\Repositories\UserRepository;
use DefStudio\Telegraph\Handlers\WebhookHandler;
use DefStudio\Telegraph\Keyboard\Button;
use DefStudio\Telegraph\Keyboard\Keyboard;
use Exception;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class BotHandler extends WebhookHandler
{
    /**
     * @param UserRepository $userRepository
     */
    public function __construct(private readonly UserRepository $userRepository)
    {
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

        $referrerChatId = $this->userRepository->getReferrerChatId($this->message->text() ?? '');
        $referrerUserId = null;

        if ($referrerChatId) {
            $referrer = $this->userRepository->getUserByChatId($referrerChatId);
            $referrerUserId = $referrer?->id;
        }

        try {
            $user = $this->userRepository->create($telegramUser, $referrerUserId);

            $message = "*Привет, {$telegramUser->firstName()}!* 👋";

            if ($referrerUserId && $user->wasRecentlyCreated) {
                $referrer = User::find($referrerUserId);
                if ($referrer) {
                    $message .= "\n\nТы был приглашен пользователем: *@{$referrer->username}*";
                }
            }

            $this->chat->markdown($message)->send();

        } catch (\Exception $e) {
            $this->chat->markdown("❌ Произошла ошибка при регистрации. Попробуйте еще раз.")->send();
        }
    }

    /**
     * Метод вызывается при вводе команды /plans
     *
     * @return void
     */
    public function plans(): void
    {
        $this->chat->markdown("Можете выбрать один из тарифов")
            ->keyboard(Keyboard::make()
                ->buttons([
                    Button::make('Лимитные')->action('limit'),
                    Button::make('Безлимитные')->action('unlimited'),
                ]))->send();
    }

    /**
     * Метод вызывает при вводе callback /limit
     *
     * @return void
     */
    public function limit(): void
    {
        $this->chat->markdown("Лимитные тарифы предоставляют 50Гб на месяц")
            ->keyboard(Keyboard::make()
                ->row([
                    Button::make('1 мес - 199 руб')->action('1month'),
                    Button::make('3 мес - 499 руб')->action('3months'),
                ])
                ->row([
                    Button::make('6 мес - 999 руб')->action('6months'),
                    Button::make('12 мес - 1499 руб')->action('12months'),
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
        $this->chat->markdown("Безлимитные тарифы без ограничения по трафику")
            ->keyboard(Keyboard::make()
                ->row([
                    Button::make('1 мес - 399 руб')->action('1month'),
                    Button::make('3 мес - 1099 руб')->action('3months'),
                ])
                ->row([
                    Button::make('6 мес - 1999 руб')->action('6months'),
                    Button::make('12 мес - 3499 руб')->action('12months'),
                ]))
            ->send();
    }

    /**
     * Метод вызывается при вводе команды /profile
     *
     * @return void
     */
    public function profile(): void
    {
        $user = $this->userRepository->getUserByChatId($this->message->from()->id());
        $message = "*Личный кабинет*!\n\n";
        $message .= "• ID: `{$user->chat_id}`\n";
        $message .= "• Имя: {$user->first_name}\n";
        $message .= "• Username: @{$user->username}\n";

        $message .= "\n✅ Ты успешно зарегистрирован в системе!";

        $this->chat->markdown($message)->send();
    }

    /**
     * Метод вызывается при вводе команды /help
     *
     * @return void
     */
    public function help(): void
    {
        $this->chat->markdown("Помощь по использованию бота и подписки")->send();
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

        $this->reply('Извините, произошла ошибка. Сервер временно не отвечает.');
    }
}
