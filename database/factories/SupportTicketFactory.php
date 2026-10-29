<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\SupportTicketStatus;
use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Attributes\UseModel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<SupportTicket> */
#[UseModel(SupportTicket::class)]
final class SupportTicketFactory extends Factory
{
    /**
     * Формирует открытое обращение для isolated persistence tests.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return ['user_id' => User::factory()->web()->verified(), 'subject' => fake()->sentence(), 'status' => SupportTicketStatus::Open,
            'last_activity_at' => now(), 'submission_id' => (string) Str::uuid(), 'submission_hash' => hash('sha256', 'fixture')];
    }
}
