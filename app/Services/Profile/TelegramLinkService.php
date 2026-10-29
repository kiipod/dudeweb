<?php

declare(strict_types=1);

namespace App\Services\Profile;

use App\Enums\TelegramLinkState;
use App\Models\TelegramAccountLink;
use App\Models\TelegramBot;
use App\Models\User;
use DefStudio\Telegraph\DTO\User as TelegramUser;
use Illuminate\Container\Attributes\Config;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

final readonly class TelegramLinkService
{
    /**
     * Принимает public bot name; токен бота никогда не попадает в web props.
     *
     * @param string|null $botUsername
     */
    public function __construct(#[Config('services.telegram.bot_username')] private ?string $botUsername) {}

    /**
     * Проверяет однозначный bot mapping для штатного secret-path webhook.
     *
     * @return TelegramBot|null
     */
    public function bot(): ?TelegramBot
    {
        if (preg_match('/\A[A-Za-z0-9_]{5,32}\z/', ltrim($this->botUsername ?? '', '@')) !== 1) {
            return null;
        }
        $id = config('services.telegram.link_bot_id');
        if (filled($id)) {
            if (filter_var($id, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) === false) {
                return null;
            }
            return TelegramBot::query()->find((int) $id);
        }
        $bots = TelegramBot::query()->limit(2)->get();
        return $bots->count() === 1 ? $bots->first() : null;
    }

    /**
     * Создаёт короткоживущую ссылку, привязанную к текущей web session.
     *
     * @param User $actor
     * @param string $sessionId
     *
     * @return string
     *
     * @throws \Throwable
     */
    public function start(User $actor, #[\SensitiveParameter] string $sessionId): string
    {
        Gate::forUser($actor)->authorize('link-account-telegram');
        $bot = $this->bot();
        if ($bot === null) {
            throw ValidationException::withMessages(['telegram' => 'Привязка Telegram временно недоступна. Попробуй позже.']);
        }
        $token = Str::random(32);
        DB::transaction(function () use ($actor, $sessionId, $bot, $token): void {
            $user = User::query()->lockForUpdate()->findOrFail($actor->id);
            Gate::forUser($user)->authorize('link-account-telegram');
            TelegramAccountLink::query()->where('user_id', $user->id)
                ->whereIn('state', [TelegramLinkState::Pending, TelegramLinkState::AwaitingTelegram, TelegramLinkState::Ready])
                ->update(['state' => TelegramLinkState::Cancelled->value]);
            TelegramAccountLink::query()->create([
                'user_id' => $user->id, 'bot_id' => $bot->id,
                'token_hash' => hash('sha256', $token), 'session_hash' => hash('sha256', $sessionId),
                'expires_at' => now()->addMinutes(10),
            ]);
        });
        return 'https://t.me/' . ltrim($this->botUsername, '@') . '?start=link_' . $token;
    }

    /**
     * Привязывает challenge к отправителю private chat до явного bot consent.
     *
     * @param string $token
     * @param int $botId
     * @param TelegramUser $telegram
     *
     * @return string Подтверждаемый email web account.
     *
     * @throws \Throwable
     */
    public function identify(#[\SensitiveParameter] string $token, int $botId, TelegramUser $telegram): string
    {
        return DB::transaction(function () use ($token, $botId, $telegram): string {
            $link = $this->challenge($token, $botId);
            if ($link->state !== TelegramLinkState::Pending
                && !($link->state === TelegramLinkState::AwaitingTelegram && $link->telegram_chat_id === $telegram->id())) {
                $this->invalid();
            }
            $link->update([
                'telegram_chat_id' => $telegram->id(), 'telegram_username' => $telegram->username() ?: null,
                'telegram_is_premium' => $telegram->isPremium(), 'state' => TelegramLinkState::AwaitingTelegram,
            ]);
            return User::query()->findOrFail($link->user_id)->email;
        });
    }

    /**
     * Принимает явное согласие именно того Telegram user, который открыл ссылку.
     *
     * @param string $token
     * @param int $botId
     * @param TelegramUser $telegram
     * @param bool $accept
     *
     * @return void
     *
     * @throws \Throwable
     */
    public function consent(#[\SensitiveParameter] string $token, int $botId, TelegramUser $telegram, bool $accept): void
    {
        Cache::lock('telegram-link-chat:' . $telegram->id(), 30)->block(5, function () use ($token, $botId, $telegram, $accept): void {
            DB::transaction(function () use ($token, $botId, $telegram, $accept): void {
                $link = $this->challenge($token, $botId);
                if ($link->state !== TelegramLinkState::AwaitingTelegram || $link->telegram_chat_id !== $telegram->id()) {
                    $this->invalid();
                }
                $link->update([
                    'state' => $accept ? TelegramLinkState::Ready : TelegramLinkState::Cancelled,
                    'confirmed_at' => $accept ? now() : null,
                ]);
            });
        });
    }

    /**
     * Возвращает безопасный статус только владельцу; proof hashes не выдаются.
     *
     * @param User $user
     * @param string $sessionId
     *
     * @return array<string, mixed>
     */
    public function status(User $user, #[\SensitiveParameter] string $sessionId): array
    {
        $link = TelegramAccountLink::query()->where('user_id', $user->id)->latest('id')->first();
        $state = $link?->state;
        $expirable = in_array($state, [TelegramLinkState::Pending, TelegramLinkState::AwaitingTelegram, TelegramLinkState::Ready], true);
        return [
            'available' => $this->bot() !== null && $user->remnawave_user_id !== null,
            'link' => $link === null ? null : [
                'id' => $link->id,
                'state' => $expirable && $link->expires_at->isPast() ? 'expired' : $state->value,
                'username' => $link->telegram_username,
                'canConfirm' => hash_equals($link->session_hash, hash('sha256', $sessionId)),
                'failed' => $link->last_error !== null,
            ],
        ];
    }

    /**
     * Разрешает только ещё действующий proof на том же боте.
     *
     * @param string $token
     * @param int $botId
     *
     * @return TelegramAccountLink
     *
     * @throws ValidationException
     */
    private function challenge(#[\SensitiveParameter] string $token, int $botId): TelegramAccountLink
    {
        if (preg_match('/\A[A-Za-z0-9]{32}\z/', $token) !== 1) {
            $this->invalid();
        }
        $link = TelegramAccountLink::query()->where('token_hash', hash('sha256', $token))
            ->where('bot_id', $botId)->lockForUpdate()->first();
        if ($link === null || $link->expires_at->isPast()) {
            $this->invalid();
        }
        return $link;
    }

    /**
     * Не раскрывает существование чужого challenge и данные аккаунта.
     *
     * @return never
     *
     * @throws ValidationException
     */
    private function invalid(): never
    {
        throw ValidationException::withMessages(['telegram' => 'Ссылка недействительна или устарела. Запроси новую привязку в своём профиле.']);
    }
}
