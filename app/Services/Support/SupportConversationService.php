<?php

declare(strict_types=1);

namespace App\Services\Support;

use App\Enums\SupportTicketStatus;
use App\Models\SupportMessage;
use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use MoonShine\Laravel\Models\MoonshineUser;

final class SupportConversationService
{
    public const int SUBJECT_MAX = 160;
    public const int BODY_MAX = 10000;

    /**
     * Атомарно создаёт обращение и первое сообщение; UUID исключает повтор.
     *
     * @param User $user
     * @param string $subject
     * @param string $body
     * @param string $submissionId
     *
     * @return SupportTicket
     *
     * @throws \Throwable
     */
    public function create(User $user, string $subject, string $body, string $submissionId): SupportTicket
    {
        Gate::forUser($user)->authorize('create', SupportTicket::class);
        return DB::transaction(function () use ($user, $subject, $body, $submissionId): SupportTicket {
            User::query()->lockForUpdate()->findOrFail($user->id);
            $hash = hash('sha256', $subject . "\0" . $body);
            $existing = SupportTicket::query()->where('user_id', $user->id)->where('submission_id', $submissionId)->first();
            if ($existing !== null) {
                $this->assertReplay($existing->submission_hash, $hash);
                return $existing;
            }
            $ticket = SupportTicket::query()->create([
                'user_id' => $user->id, 'subject' => $subject, 'status' => SupportTicketStatus::Open,
                'last_activity_at' => now(), 'submission_id' => $submissionId, 'submission_hash' => $hash,
            ]);
            $ticket->messages()->create(['customer_id' => $user->id, 'body' => $body,
                'submission_id' => $submissionId, 'submission_hash' => hash('sha256', $body)]);
            return $ticket;
        });
    }

    /**
     * Сериализует reply со сменой статуса и устанавливает ровно одного автора.
     *
     * @param User|MoonshineUser $actor
     * @param SupportTicket $ticket
     * @param string $body
     * @param string $submissionId
     *
     * @return SupportMessage
     *
     * @throws \Throwable
     */
    public function reply(User|MoonshineUser $actor, SupportTicket $ticket, string $body, string $submissionId): SupportMessage
    {
        return DB::transaction(function () use ($actor, $ticket, $body, $submissionId): SupportMessage {
            $locked = SupportTicket::query()->lockForUpdate()->findOrFail($ticket->id);
            Gate::forUser($actor)->authorize('view', $locked);
            if ($locked->status !== SupportTicketStatus::Open) {
                throw ValidationException::withMessages(['body' => 'Обращение закрыто. Создай новое, если нужна помощь.']);
            }
            Gate::forUser($actor)->authorize('reply', $locked);
            $customer = $actor instanceof User ? $actor->id : null;
            $operator = $actor instanceof MoonshineUser ? $actor->id : null;
            $hash = hash('sha256', $body);
            $existing = $locked->messages()->where('submission_id', $submissionId)->first();
            if ($existing !== null) {
                if ($existing->customer_id !== $customer || $existing->operator_id !== $operator) {
                    throw ValidationException::withMessages(['form' => 'Обнови страницу и попробуй отправить сообщение ещё раз.']);
                }
                $this->assertReplay($existing->submission_hash, $hash);
                return $existing;
            }
            $message = $locked->messages()->create(['customer_id' => $customer, 'operator_id' => $operator,
                'body' => $body, 'submission_id' => $submissionId, 'submission_hash' => $hash]);
            $locked->update(['last_activity_at' => now()]);
            return $message;
        });
    }

    /**
     * Идемпотентно закрывает/открывает обращение под общей reply-блокировкой.
     *
     * @param MoonshineUser $operator
     * @param SupportTicket $ticket
     * @param SupportTicketStatus $status
     *
     * @return void
     *
     * @throws \Throwable
     */
    public function transition(MoonshineUser $operator, SupportTicket $ticket, SupportTicketStatus $status): void
    {
        DB::transaction(function () use ($operator, $ticket, $status): void {
            $locked = SupportTicket::query()->lockForUpdate()->findOrFail($ticket->id);
            Gate::forUser($operator)->authorize('transition', $locked);
            if ($locked->status !== $status) {
                $locked->update(['status' => $status, 'closed_at' => $status === SupportTicketStatus::Closed ? now() : null, 'last_activity_at' => now()]);
            }
        });
    }

    /**
     * Не позволяет повторно использовать UUID с изменённым содержимым.
     *
     * @param string $stored
     * @param string $current
     *
     * @return void
     *
     * @throws ValidationException
     */
    private function assertReplay(string $stored, string $current): void
    {
        if (!hash_equals($stored, $current)) {
            throw ValidationException::withMessages(['form' => 'Этот запрос уже отправлен. Обнови страницу перед новым сообщением.']);
        }
    }
}
