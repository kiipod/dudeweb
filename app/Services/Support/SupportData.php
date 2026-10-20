<?php

declare(strict_types=1);

namespace App\Services\Support;

use App\Models\SupportMessage;
use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Support\Str;

class SupportData
{
    public const int MESSAGES_PER_PAGE = 50;

    /**
     * Возвращает последнюю страницу, чтобы после reply был виден сохранённый ответ.
     *
     * @param SupportTicket $ticket
     *
     * @return int
     */
    public function lastMessagePage(SupportTicket $ticket): int
    {
        return max(1, (int) ceil($ticket->messages()->count() / self::MESSAGES_PER_PAGE));
    }

    /**
     * Возвращает страницу только собственных обращений с bounded preview query.
     *
     * @param User $user
     *
     * @return array<string, mixed>
     */
    public function listing(User $user): array
    {
        $tickets = SupportTicket::query()->where('user_id', $user->id)
            ->with('latestMessage:id,ticket_id,body,created_at')->orderByDesc('last_activity_at')->orderByDesc('id')->paginate(20);
        return ['serviceState' => 'ready', 'tickets' => $tickets->through(fn(SupportTicket $ticket): array => [
            ...$this->ticket($ticket), 'preview' => Str::limit($ticket->latestMessage?->body ?? '', 180),
            'url' => route('account.support.show', $ticket),
        ])];
    }

    /**
     * Возвращает только безопасные атрибуты ticket без author/owner identifiers.
     *
     * @param SupportTicket $ticket
     *
     * @return array<string, mixed>
     */
    public function ticket(SupportTicket $ticket): array
    {
        return ['subject' => $ticket->subject, 'status' => $ticket->status->value, 'statusLabel' => $ticket->status->label(),
            'updatedAt' => $ticket->last_activity_at->toIso8601String(),
            'updatedLabel' => $ticket->last_activity_at->translatedFormat('j F Y, H:i')];
    }

    /**
     * Возвращает oldest-first conversation page и данные нового reply intent.
     *
     * @param SupportTicket $ticket
     *
     * @return array<string, mixed>
     */
    public function conversation(SupportTicket $ticket): array
    {
        $messages = $ticket->messages()->orderBy('created_at')->orderBy('id')->paginate(self::MESSAGES_PER_PAGE);
        return ['serviceState' => 'ready', 'ticket' => [...$this->ticket($ticket), 'replyUrl' => route('account.support.messages.store', $ticket)],
            'messages' => $messages->through(fn(SupportMessage $message): array => [
                'id' => $message->id, 'body' => $message->body, 'author' => $message->customer_id === null ? 'operator' : 'customer',
                'authorLabel' => $message->customer_id === null ? 'Поддержка' : 'Ты',
                'createdAt' => $message->created_at->toIso8601String(), 'timeLabel' => $message->created_at->translatedFormat('j F, H:i'),
            ]), ...$this->form()];
    }

    /**
     * Возвращает server-owned ограничения формы и отдельный submission UUID.
     *
     * @return array<string, mixed>
     */
    public function form(): array
    {
        return ['submissionId' => (string) Str::uuid(), 'subjectMax' => SupportConversationService::SUBJECT_MAX, 'bodyMax' => SupportConversationService::BODY_MAX];
    }
}
