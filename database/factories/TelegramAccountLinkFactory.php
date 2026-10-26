<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\TelegramLinkState;
use App\Models\TelegramAccountLink;
use App\Models\TelegramBot;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<TelegramAccountLink> */
#[UseModel(TelegramAccountLink::class)]
final class TelegramAccountLinkFactory extends Factory
{
    /**
     * Создаёт независимый одноразовый challenge для web identity.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->web()->verified(),
            'bot_id' => TelegramBot::factory(),
            'token_hash' => hash('sha256', Str::random(32)),
            'session_hash' => hash('sha256', Str::random(40)),
            'state' => TelegramLinkState::Pending,
            'expires_at' => now()->addMinutes(10),
        ];
    }
}
