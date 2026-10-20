<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\SupportTicketStatus;
use App\Policies\SupportTicketPolicy;
use Database\Factories\SupportTicketFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property int $user_id
 * @property string $subject
 * @property SupportTicketStatus $status
 * @property string $submission_hash
 */
#[UseFactory(SupportTicketFactory::class)]
#[UsePolicy(SupportTicketPolicy::class)]
final class SupportTicket extends Model
{
    /** @use HasFactory<SupportTicketFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = ['user_id', 'subject', 'status', 'closed_at', 'last_activity_at', 'submission_id', 'submission_hash'];

    /** @var array<string, string> */
    protected $casts = ['user_id' => 'integer', 'status' => SupportTicketStatus::class, 'closed_at' => 'datetime', 'last_activity_at' => 'datetime'];

    /**
     * Возвращает владельца обращения.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Возвращает сообщения, без неявной загрузки всей conversation.
     *
     * @return HasMany
     */
    public function messages(): HasMany
    {
        return $this->hasMany(SupportMessage::class, 'ticket_id');
    }

    /**
     * Возвращает последний persisted preview с deterministic ID tie-breaker.
     *
     * @return HasOne
     */
    public function latestMessage(): HasOne
    {
        return $this->hasOne(SupportMessage::class, 'ticket_id')->ofMany(['created_at' => 'max', 'id' => 'max']);
    }
}
