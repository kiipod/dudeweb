<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\SupportMessage;
use App\Models\SupportTicket;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<SupportMessage> */
#[UseModel(SupportMessage::class)]
final class SupportMessageFactory extends Factory
{
    /**
     * Формирует customer message, принадлежащее владельцу ticket.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return ['ticket_id' => SupportTicket::factory(), 'customer_id' => fn(array $data): int => SupportTicket::findOrFail($data['ticket_id'])->user_id,
            'operator_id' => null, 'body' => fake()->paragraph(), 'submission_id' => (string) Str::uuid(), 'submission_hash' => hash('sha256', 'fixture')];
    }
}
