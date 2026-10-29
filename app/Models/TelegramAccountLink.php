<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\TelegramLinkState;
use Database\Factories\TelegramAccountLinkFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[UseFactory(TelegramAccountLinkFactory::class)]
final class TelegramAccountLink extends Model
{
    /** @use HasFactory<TelegramAccountLinkFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'user_id', 'bot_id', 'token_hash', 'session_hash', 'telegram_chat_id',
        'telegram_username', 'telegram_is_premium', 'telegram_user_id', 'state',
        'plan', 'last_error', 'expires_at', 'confirmed_at', 'completed_at',
    ];

    /** @var list<string> */
    protected $hidden = ['token_hash', 'session_hash', 'plan'];

    /** @var array<string, string> */
    protected $casts = [
        'state' => TelegramLinkState::class,
        'plan' => 'array',
        'telegram_chat_id' => 'integer',
        'telegram_is_premium' => 'boolean',
        'expires_at' => 'immutable_datetime',
        'confirmed_at' => 'immutable_datetime',
        'completed_at' => 'immutable_datetime',
    ];
}
