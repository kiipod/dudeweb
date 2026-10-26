<?php

declare(strict_types=1);

namespace App\Services\Profile;

use App\Enums\ReferralRewardStatus;
use App\Enums\TelegramLinkState;
use App\Models\Payment;
use App\Models\ReferralReward;
use App\Models\TelegramAccountLink;
use App\Models\User;
use App\Payment\Enums\PaymentStatus;
use App\Remnawave\DTO\UpdateUserRequestDto;
use App\Remnawave\Enums\UserStatus;
use App\Remnawave\Exceptions\ApiException;
use App\Remnawave\RemnawaveApi;
use App\Services\SubscriptionMutationLock;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Throwable;

final readonly class TelegramAccountMerger
{
    /**
     * Принимает remote boundary, durable plan, ownership transfer и общие locks.
     *
     * @param RemnawaveApi $api
     * @param AccountMergePlan $plans
     * @param AccountMergeOwnership $ownership
     * @param SubscriptionMutationLock $locks
     */
    public function __construct(
        private RemnawaveApi $api,
        private AccountMergePlan $plans,
        private AccountMergeOwnership $ownership,
        private SubscriptionMutationLock $locks,
    ) {}

    /**
     * Проверяет web owner/session proof перед необратимыми merge stages.
     *
     * @param User $actor
     * @param int $id
     * @param string $sessionId
     *
     * @return User
     *
     * @throws Throwable
     */
    public function finish(User $actor, int $id, #[\SensitiveParameter] string $sessionId): User
    {
        Gate::forUser($actor)->authorize('view-account-profile');
        $link = TelegramAccountLink::query()->where('user_id', $actor->id)->findOrFail($id);
        if ($link->state === TelegramLinkState::Ready) {
            if ($link->expires_at->isPast() || !hash_equals($link->session_hash, hash('sha256', $sessionId))) {
                throw ValidationException::withMessages(['telegram' => 'Заверши привязку в том браузере, где она началась, или запроси новую ссылку.']);
            }
            $this->prepare($link);
        } elseif (!in_array($link->state, [TelegramLinkState::Applying, TelegramLinkState::RemoteApplied, TelegramLinkState::LocalApplied, TelegramLinkState::Complete], true)) {
            throw ValidationException::withMessages(['telegram' => 'Сначала подтверди привязку в Telegram.']);
        }
        $this->resume($link->id);
        return User::query()->findOrFail($link->fresh()->user_id);
    }

    /**
     * Резервирует identities под subscription locks до чтения remote snapshots.
     *
     * @param TelegramAccountLink $link
     *
     * @return void
     *
     * @throws Throwable
     */
    private function prepare(TelegramAccountLink $link): void
    {
        Cache::lock('telegram-link-chat:' . $link->telegram_chat_id, 120)->block(10, function () use ($link): void {
            $telegram = User::query()->where('chat_id', $link->telegram_chat_id)->first();
            $ids = array_values(array_unique(array_filter([$link->user_id, $telegram?->id])));
            $this->locks->merge($ids, function () use ($link, $telegram, $ids): void {
                DB::transaction(function () use ($link, $telegram, $ids): void {
                    $link = TelegramAccountLink::query()->lockForUpdate()->findOrFail($link->id);
                    if ($link->state !== TelegramLinkState::Ready || $link->expires_at->isPast()) {
                        throw ValidationException::withMessages(['telegram' => 'Подтверждение устарело. Запроси новую привязку.']);
                    }
                    $users = User::query()->whereKey($ids)->orderBy('id')->lockForUpdate()->get();
                    $web = $users->firstWhere('id', $link->user_id);
                    if ($web === null || $web->chat_id !== null || $users->contains(fn(User $user): bool => $user->telegram_merge_id !== null)) {
                        throw ValidationException::withMessages(['telegram' => 'Для этого аккаунта уже выполняется привязка. Обнови профиль.']);
                    }
                    Gate::forUser($web)->authorize('link-account-telegram');
                    $processingPayment = Payment::query()->whereIn('user_id', $ids)->where(function ($query): void {
                        $query->where('status', PaymentStatus::Pending)->orWhereNotNull('processing_token');
                    })->exists();
                    $pendingReward = ReferralReward::query()->whereIn('referrer_user_id', $ids)
                        ->where('status', ReferralRewardStatus::Pending)->whereNotNull('target_expires_at')->exists();
                    if ($processingPayment || $pendingReward) {
                        throw ValidationException::withMessages(['telegram' => 'Дождись завершения оплаты или начисления бонуса, затем повтори привязку.']);
                    }
                    User::query()->whereKey($ids)->update(['telegram_merge_id' => $link->id]);
                    $link->update(['telegram_user_id' => $telegram?->id, 'state' => TelegramLinkState::Applying]);
                });
            });
        });
    }

    /**
     * Продолжает подтверждённые stages после ошибки API или падения процесса.
     *
     * @param int $id
     *
     * @return void
     *
     * @throws Throwable
     */
    public function resume(int $id): void
    {
        $link = TelegramAccountLink::query()->findOrFail($id);
        if ($link->state === TelegramLinkState::Complete) {
            return;
        }
        if (!in_array($link->state, [TelegramLinkState::Applying, TelegramLinkState::RemoteApplied, TelegramLinkState::LocalApplied], true)) {
            throw new \DomainException('Only a confirmed merge may be resumed.');
        }
        Cache::lock('telegram-link-chat:' . $link->telegram_chat_id, 120)->block(10, function () use ($link): void {
            $ids = $link->plan === null ? array_filter([$link->user_id, $link->telegram_user_id])
                : array_filter([$link->plan['survivor_user_id'], $link->plan['loser_user_id']]);
            $this->locks->merge(array_values($ids), function () use ($link): void {
                $link->refresh();
                try {
                    if ($link->plan === null) {
                        $web = User::query()->findOrFail($link->user_id);
                        $telegram = $link->telegram_user_id === null ? null : User::query()->findOrFail($link->telegram_user_id);
                        $link->update(['plan' => $this->plans->build($web, $telegram, $link->telegram_chat_id)]);
                    }
                    if ($link->state === TelegramLinkState::Applying) {
                        $this->applyRemote($link);
                        $link->update(['state' => TelegramLinkState::RemoteApplied, 'last_error' => null]);
                    }
                    if ($link->state === TelegramLinkState::RemoteApplied) {
                        $this->ownership->apply($link);
                        $link->refresh();
                    }
                    if ($link->state === TelegramLinkState::LocalApplied) {
                        $this->cleanup($link);
                    }
                } catch (Throwable $exception) {
                    $link->refresh()->update(['last_error' => $exception::class]);
                    throw $exception;
                }
            });
        });
    }

    /**
     * Подтверждает исходные bounds и применяет один абсолютный expiration target.
     *
     * @param TelegramAccountLink $link
     *
     * @return void
     *
     * @throws Throwable
     */
    private function applyRemote(TelegramAccountLink $link): void
    {
        $plan = $link->plan;
        $remote = $this->api->users()->withTimeouts(5, 3)->getUserById($plan['survivor_remote_id'])->response;
        $expiry = CarbonImmutable::parse($remote->expireAt);
        if ($remote->id !== $plan['survivor_remote_id']
            || !hash_equals($plan['credentials_hash'], $this->plans->credentialsHash($remote))
            || (!$expiry->equalTo(CarbonImmutable::parse($plan['survivor_original_expires_at']))
                && !$expiry->equalTo(CarbonImmutable::parse($plan['target_expires_at'])))) {
            throw new \DomainException('Remote survivor changed during account merge; reconciliation is required.');
        }
        if ($plan['loser_remote_id'] !== null) {
            $loser = $this->api->users()->withTimeouts(5, 3)->getUserById($plan['loser_remote_id'])->response;
            if ($loser->id !== $plan['loser_remote_id']
                || !CarbonImmutable::parse($loser->expireAt)->equalTo(CarbonImmutable::parse($plan['loser_original_expires_at']))) {
                throw new \DomainException('Losing subscription changed during account merge; reconciliation is required.');
            }
            $this->api->users()->withTimeouts(5, 3)->update(new UpdateUserRequestDto(
                id: $loser->id,
                clearEmail: true,
                clearTelegramId: true,
            ));
        }
        $result = $this->api->users()->withTimeouts(5, 3)->update(new UpdateUserRequestDto(
            id: $remote->id,
            status: $plan['target_status'] === null ? null : UserStatus::from($plan['target_status']),
            expireAt: $plan['target_expires_at'],
            tag: $plan['target_tag'],
            telegramId: $link->telegram_chat_id,
            email: $plan['email'],
        ))->response;
        if ($result->id !== $remote->id || $result->telegramId !== $link->telegram_chat_id
            || $result->email !== $plan['email'] || !CarbonImmutable::parse($result->expireAt)->equalTo(CarbonImmutable::parse($plan['target_expires_at']))
            || !hash_equals($plan['credentials_hash'], $this->plans->credentialsHash($result))) {
            throw new \DomainException('Remnawave did not confirm the merged subscription.');
        }
    }

    /**
     * Удаляет только losing remote после local commit; 404 означает успешный retry.
     *
     * @param TelegramAccountLink $link
     *
     * @return void
     *
     * @throws Throwable
     */
    private function cleanup(TelegramAccountLink $link): void
    {
        $loser = $link->plan['loser_remote_id'];
        if ($loser !== null) {
            try {
                $this->api->users()->withTimeouts(5, 3)->delete($loser);
            } catch (ApiException $exception) {
                if ($exception->getCode() !== 404) {
                    throw $exception;
                }
            }
        }
        DB::transaction(function () use ($link): void {
            User::query()->where('telegram_merge_id', $link->id)->update(['telegram_merge_id' => null]);
            $link->update(['state' => TelegramLinkState::Complete, 'last_error' => null, 'completed_at' => now()]);
        });
    }
}
