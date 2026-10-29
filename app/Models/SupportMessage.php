<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\SupportMessageFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $ticket_id
 * @property int|null $customer_id
 * @property int|null $operator_id
 * @property string $body
 * @property string $submission_hash
 */
#[UseFactory(SupportMessageFactory::class)]
final class SupportMessage extends Model
{
    /** @use HasFactory<SupportMessageFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = ['ticket_id', 'customer_id', 'operator_id', 'body', 'submission_id', 'submission_hash'];

    /** @var array<string, string> */
    protected $casts = ['customer_id' => 'integer', 'operator_id' => 'integer'];

    /**
     * Возвращает родительское обращение.
     *
     * @return BelongsTo
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(SupportTicket::class, 'ticket_id');
    }
}
