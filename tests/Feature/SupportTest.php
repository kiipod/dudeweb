<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\SupportTicketStatus;
use App\Models\SupportMessage;
use App\Models\SupportTicket;
use App\Models\User;
use App\MoonShine\Resources\SupportTicket\SupportTicketResource;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use MoonShine\Laravel\Models\MoonshineUser;
use MoonShine\Laravel\Models\MoonshineUserRole;
use MoonShine\Support\Enums\Action;
use RuntimeException;
use Tests\TestCase;

final class SupportTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Проверяет auth/verification boundary и пустой own list.
     *
     * @return void
     */
    public function test_support_requires_verified_web_session(): void
    {
        $this->get('/account/support')->assertRedirect('/login');
        $this->postJson('/account/support')->assertUnauthorized();
        $this->actingAs(User::factory()->web()->create(), 'web')->get('/account/support')->assertRedirect('/email/verify');
    }

    /**
     * Возвращает честный empty state и server-owned form limits.
     *
     * @return void
     */
    public function test_empty_list_and_create_contract(): void
    {
        $this->actingAs($this->customer(), 'web')->get('/account/support')->assertOk()
            ->assertHeader('Cache-Control', 'no-store, private')->assertInertia(fn(Assert $p) => $p->component('Account/Support/Index')->has('tickets.data', 0));
        $this->get('/account/support/create')->assertInertia(fn(Assert $p) => $p->component('Account/Support/Create')
            ->where('subjectMax', 160)->where('bodyMax', 10000)->has('submissionId'));
    }

    /**
     * Проверяет FormRequest limits и отсутствие записей после invalid submit.
     *
     * @return void
     */
    public function test_validation_does_not_persist_incomplete_ticket(): void
    {
        $this->actingAs($this->customer(), 'web')->postJson('/account/support', ['subject' => str_repeat('a', 161), 'body' => '', 'submission_id' => 'bad'])
            ->assertUnprocessable()->assertJsonValidationErrors(['subject', 'body', 'submission_id']);
        $this->postJson('/account/support', ['subject' => 'Вопрос', 'body' => str_repeat('a', 10001), 'submission_id' => (string) Str::uuid()])->assertJsonValidationErrors('body');
        $this->assertDatabaseCount('support_tickets', 0);
    }

    /**
     * Создаёт ticket/message атомарно и не принимает owner/status/author от клиента.
     *
     * @return void
     */
    public function test_creation_is_owned_atomic_and_idempotent(): void
    {
        $owner = $this->customer();
        $payload = $this->payload() + ['user_id' => 999, 'operator_id' => 999, 'status' => 'CLOSED'];
        $this->actingAs($owner, 'web')->post('/account/support', $payload)->assertRedirect();
        $ticket = SupportTicket::query()->sole();
        self::assertSame($owner->id, $ticket->user_id);
        self::assertSame(SupportTicketStatus::Open, $ticket->status);
        $this->assertDatabaseHas('support_messages', ['ticket_id' => $ticket->id, 'customer_id' => $owner->id, 'operator_id' => null, 'body' => $payload['body']]);
        $this->post('/account/support', $payload)->assertRedirect(route('account.support.show', $ticket));
        $this->assertDatabaseCount('support_tickets', 1);
        $this->assertDatabaseCount('support_messages', 1);
        $payload['body'] = 'Другой текст';
        $this->post('/account/support', $payload)->assertSessionHasErrors('form');
    }

    /**
     * Проверяет rollback первого сообщения и safe error boundary.
     *
     * @return void
     */
    public function test_message_insert_failure_rolls_back_ticket_without_private_error(): void
    {
        Log::spy();
        SupportMessage::creating(fn() => throw new RuntimeException('private database detail'));
        try {
            $this->actingAs($this->customer(), 'web')->from('/account/support/create')->post('/account/support', $this->payload())
                ->assertRedirect('/account/support/create')->assertSessionHasErrors('form');
            $this->assertDatabaseCount('support_tickets', 0);
            $this->assertDatabaseCount('support_messages', 0);
            Log::shouldHaveReceived('warning')->with('Support mutation failed.', ['exception' => RuntimeException::class]);
        } finally {
            SupportMessage::flushEventListeners();
        }
    }

    /**
     * Запрещает чтение/reply чужого обращения, включая forged author ID.
     *
     * @return void
     */
    public function test_customer_cannot_read_or_reply_to_another_ticket(): void
    {
        $ticket = SupportTicket::factory()->create();
        $this->actingAs($this->customer(), 'web')->get(route('account.support.show', $ticket))->assertForbidden();
        $this->post(route('account.support.messages.store', $ticket), ['body' => 'Взлом', 'submission_id' => (string) Str::uuid(), 'customer_id' => $ticket->user_id])->assertForbidden();
        $this->assertDatabaseCount('support_messages', 0);
    }

    /**
     * Own activity ordering и preview остаются bounded и не включают чужие записи.
     *
     * @return void
     */
    public function test_listing_is_owned_newest_activity_first_with_bounded_queries(): void
    {
        $owner = $this->customer();
        $old = SupportTicket::factory()->create(['user_id' => $owner->id, 'last_activity_at' => now()->subDay()]);
        $first = SupportTicket::factory()->create(['user_id' => $owner->id, 'last_activity_at' => now()]);
        $last = SupportTicket::factory()->create(['user_id' => $owner->id, 'last_activity_at' => now()]);
        SupportTicket::factory()->create(['subject' => 'Чужое']);
        SupportMessage::factory()->create(['ticket_id' => $old->id, 'body' => 'Последний текст']);
        $this->actingAs($owner, 'web')->get('/account/support?user_id=999')->assertInertia(fn(Assert $p) => $p->has('tickets.data', 3)
            ->where('tickets.data.0.subject', $last->subject)->where('tickets.data.1.subject', $first->subject)
            ->where('tickets.data.2.preview', 'Последний текст')->missing('tickets.data.0.user_id'));
        DB::enableQueryLog();
        DB::flushQueryLog();
        app(\App\Services\Support\SupportData::class)->listing($owner);
        self::assertCount(3, DB::getQueryLog());
        DB::disableQueryLog();
    }

    /**
     * Возвращает oldest-first историю с ID tie-breaker, без raw author identifiers.
     *
     * @return void
     */
    public function test_conversation_orders_messages_and_hides_author_ids(): void
    {
        $owner = $this->customer();
        $ticket = SupportTicket::factory()->create(['user_id' => $owner->id]);
        $early = SupportMessage::factory()->create(['ticket_id' => $ticket->id, 'body' => '<script>alert(1)</script>', 'created_at' => now()->subHour()]);
        $late = SupportMessage::factory()->create(['ticket_id' => $ticket->id]);
        $this->actingAs($owner, 'web')->get(route('account.support.show', $ticket))->assertInertia(fn(Assert $p) => $p->component('Account/Support/Show')
            ->where('messages.data.0.id', $early->id)->where('messages.data.1.id', $late->id)
            ->where('messages.data.0.author', 'customer')->missing('messages.data.0.customer_id')->missing('messages.data.0.operator_id')
            ->missing('messages.data.0.submission_hash')->missing('ticket.user_id'));
    }

    /**
     * Повтор customer reply не создаёт второй записи и обновляет list activity.
     *
     * @return void
     */
    public function test_reply_is_idempotent_and_records_only_current_customer(): void
    {
        $owner = $this->customer();
        $ticket = SupportTicket::factory()->create(['user_id' => $owner->id, 'last_activity_at' => now()->subDay()]);
        $payload = ['body' => 'Мой ответ', 'submission_id' => (string) Str::uuid(), 'operator_id' => 999];
        $this->actingAs($owner, 'web')->post(route('account.support.messages.store', $ticket), $payload)->assertRedirect();
        $this->post(route('account.support.messages.store', $ticket), $payload)->assertRedirect();
        $this->assertDatabaseCount('support_messages', 1);
        self::assertSame($owner->id, SupportMessage::query()->sole()->customer_id);
        self::assertNull(SupportMessage::query()->sole()->operator_id);
        self::assertTrue($ticket->fresh()->last_activity_at->isToday());
    }

    /**
     * Проверяет native MoonShine index/detail, escaped body и разрешённые действия.
     *
     * @return void
     */
    public function test_operator_resource_renders_safe_history_and_forms(): void
    {
        $ticket = SupportTicket::factory()->create(['subject' => 'Вопрос клиента']);
        SupportMessage::factory()->create(['ticket_id' => $ticket->id, 'body' => '<script>private()</script>']);
        $resource = app(SupportTicketResource::class);
        self::assertFalse($resource->hasAction(Action::CREATE));
        self::assertFalse($resource->hasAction(Action::UPDATE));
        self::assertFalse($resource->hasAction(Action::DELETE));
        $this->actingAs($this->operator(), 'moonshine')->get($resource->getIndexPageUrl())->assertOk()->assertSee('Вопрос клиента');
        $response = $this->get($resource->getDetailPageUrl($ticket->id))->assertOk()->assertSee('&lt;script&gt;private()&lt;/script&gt;', false)
            ->assertDontSee('<script>private()</script>', false)->assertSee('Ответ клиенту')->assertSee('Закрыть обращение');
        // Native MoonShine HTML from isolated factory data for the keyboard browser check.
        File::ensureDirectoryExists(storage_path('framework/testing'));
        File::put(storage_path('framework/testing/support-operator.html'), $response->getContent());
    }

    /**
     * Operator POST author/close/reopen проходят через один domain boundary.
     *
     * @return void
     */
    public function test_operator_reply_close_reopen_and_customer_closed_prohibition(): void
    {
        $owner = $this->customer();
        $ticket = SupportTicket::factory()->create(['user_id' => $owner->id]);
        $operator = $this->operator();
        $payload = ['body' => 'Ответ поддержки', 'submission_id' => (string) Str::uuid(), 'customer_id' => $owner->id];
        $this->actingAs($operator, 'moonshine')->post(route('operator.support.reply', $ticket), $payload)->assertRedirect();
        $this->assertDatabaseHas('support_messages', ['operator_id' => $operator->id, 'customer_id' => null]);
        $this->post(route('operator.support.status', $ticket), ['status' => 'CLOSED'])->assertRedirect();
        self::assertNotNull($ticket->fresh()->closed_at);
        $this->actingAs($owner, 'web')->post(route('account.support.messages.store', $ticket), ['body' => 'Поздний ответ', 'submission_id' => (string) Str::uuid()])->assertSessionHasErrors('body');
        $this->actingAs($operator, 'moonshine')->post(route('operator.support.status', $ticket), ['status' => 'OPEN'])->assertRedirect();
        self::assertNull($ticket->fresh()->closed_at);
        $this->actingAs($owner, 'web')->post(route('account.support.messages.store', $ticket), ['body' => 'Теперь можно', 'submission_id' => (string) Str::uuid()])->assertRedirect();
        $this->assertDatabaseCount('support_messages', 2);
    }

    /**
     * Web user не получает operator capability даже при совпавших numeric IDs.
     *
     * @return void
     */
    public function test_customer_cannot_use_operator_routes_or_change_status(): void
    {
        $ticket = SupportTicket::factory()->create();
        $this->actingAs($this->customer(), 'web')->postJson(route('operator.support.status', $ticket), ['status' => 'CLOSED'])->assertUnauthorized();
        self::assertFalse(auth('web')->user()->can('transition', $ticket));
        self::assertSame(SupportTicketStatus::Open, $ticket->fresh()->status);
    }

    /**
     * DB invariant блокирует обе заполненные author FK даже вне domain service.
     *
     * @return void
     */
    public function test_database_rejects_two_authors(): void
    {
        $operator = $this->operator();
        $this->expectException(QueryException::class);
        SupportMessage::factory()->create(['operator_id' => $operator->id]);
    }

    /**
     * DB invariant блокирует сообщение без автора даже при прямой записи.
     *
     * @return void
     */
    public function test_database_rejects_missing_author(): void
    {
        $this->expectException(QueryException::class);
        SupportMessage::factory()->create(['customer_id' => null]);
    }

    /**
     * Проверяет обе bounded страницы и redirect к сохранённому reply после 50 сообщений.
     *
     * @return void
     */
    public function test_conversation_pagination_and_reply_redirect_to_latest_page(): void
    {
        $owner = $this->customer();
        $ticket = SupportTicket::factory()->create(['user_id' => $owner->id]);
        SupportMessage::factory()->count(50)->create(['ticket_id' => $ticket->id]);
        $this->actingAs($owner, 'web')->get(route('account.support.show', $ticket))
            ->assertInertia(fn(Assert $p) => $p->has('messages.data', 50)->where('messages.last_page', 1));
        $this->post(route('account.support.messages.store', $ticket), ['body' => 'Пятьдесят первое', 'submission_id' => (string) Str::uuid()])
            ->assertRedirect(route('account.support.show', ['ticket' => $ticket, 'page' => 2]));
        $this->get(route('account.support.show', ['ticket' => $ticket, 'page' => 2]))
            ->assertInertia(fn(Assert $p) => $p->has('messages.data', 1)->where('messages.data.0.body', 'Пятьдесят первое')->where('messages.total', 51));
    }

    /**
     * Не выдаёт больше одной страницы списка и не теряет metadata pagination.
     *
     * @return void
     */
    public function test_ticket_list_paginates_at_twenty_records(): void
    {
        $owner = $this->customer();
        SupportTicket::factory()->count(21)->create(['user_id' => $owner->id]);
        $this->actingAs($owner, 'web')->get('/account/support')->assertInertia(fn(Assert $p) => $p->has('tickets.data', 20)->where('tickets.last_page', 2));
        $this->get('/account/support?page=2')->assertInertia(fn(Assert $p) => $p->has('tickets.data', 1)->where('tickets.total', 21));
    }

    /**
     * Ошибки чтения не раскрывают exception или сохранённую историю.
     *
     * @return void
     */
    public function test_read_failure_returns_retryable_safe_state(): void
    {
        Log::spy();
        $owner = $this->customer();
        $ticket = SupportTicket::factory()->create(['user_id' => $owner->id]);
        $this->mock(\App\Services\Support\SupportData::class, function ($mock): void {
            $mock->shouldReceive('listing')->andThrow(new RuntimeException('private failure'));
            $mock->shouldReceive('conversation')->andThrow(new RuntimeException('private failure'));
            $mock->shouldReceive('form')->andReturn(['submissionId' => (string) Str::uuid(), 'subjectMax' => 160, 'bodyMax' => 10000]);
        });
        $this->actingAs($owner, 'web')->get('/account/support')->assertInertia(fn(Assert $p) => $p->where('serviceState', 'error')->has('tickets.data', 0));
        $this->get(route('account.support.show', $ticket))->assertInertia(fn(Assert $p) => $p->where('serviceState', 'error')->where('ticket', null)->has('messages.data', 0));
    }

    /**
     * Reply validation/replay mismatch не изменяют persisted history.
     *
     * @return void
     */
    public function test_reply_validation_and_conflicting_replay_leave_history_unchanged(): void
    {
        $owner = $this->customer();
        $ticket = SupportTicket::factory()->create(['user_id' => $owner->id]);
        $url = route('account.support.messages.store', $ticket);
        $this->actingAs($owner, 'web')->postJson($url, ['body' => '', 'submission_id' => 'bad'])->assertJsonValidationErrors(['body', 'submission_id']);
        $payload = ['body' => 'Первый ответ', 'submission_id' => (string) Str::uuid()];
        $this->post($url, $payload)->assertRedirect();
        $this->post($url, array_replace($payload, ['body' => 'Другой ответ']))->assertSessionHasErrors('form');
        $this->assertDatabaseCount('support_messages', 1);
    }

    /**
     * Operator replay, invalid status и запрет reply после close не обходят domain boundary.
     *
     * @return void
     */
    public function test_operator_validates_and_deduplicates_operations(): void
    {
        $ticket = SupportTicket::factory()->create();
        $payload = ['body' => 'Сохранённый ответ', 'submission_id' => (string) Str::uuid()];
        $this->actingAs($this->operator(), 'moonshine')->post(route('operator.support.reply', $ticket), $payload)->assertRedirect();
        $this->post(route('operator.support.reply', $ticket), $payload)->assertRedirect();
        $this->postJson(route('operator.support.status', $ticket), ['status' => 'INVALID'])->assertJsonValidationErrors('status');
        $this->post(route('operator.support.status', $ticket), ['status' => 'CLOSED'])->assertRedirect();
        $this->post(route('operator.support.reply', $ticket), ['body' => 'Поздний', 'submission_id' => (string) Str::uuid()])->assertSessionHasErrors('body');
        $this->assertDatabaseCount('support_messages', 1);
    }

    /**
     * Откатывает reply вместе с activity, если обновить ticket не удалось.
     *
     * @return void
     */
    public function test_reply_failure_rolls_back_message_and_activity(): void
    {
        Log::spy();
        $owner = $this->customer();
        $ticket = SupportTicket::factory()->create(['user_id' => $owner->id, 'last_activity_at' => now()->subDay()]);
        SupportTicket::updating(fn() => throw new RuntimeException('private database failure'));
        try {
            $this->actingAs($owner, 'web')->from(route('account.support.show', $ticket))
                ->post(route('account.support.messages.store', $ticket), ['body' => 'Не сохранится', 'submission_id' => (string) Str::uuid()])->assertSessionHasErrors('form');
            $this->assertDatabaseCount('support_messages', 0);
            self::assertTrue($ticket->fresh()->last_activity_at->equalTo($ticket->last_activity_at));
        } finally {
            SupportTicket::flushEventListeners();
        }
    }

    /**
     * Проверяет обратимость новой миграции только внутри изолированной test transaction.
     *
     * @return void
     */
    public function test_support_migration_can_be_reversed_and_reapplied(): void
    {
        $migration = require database_path('migrations/2026_10_20_194258_create_support_tables.php');
        $migration->down();
        self::assertFalse(Schema::hasTable('support_messages'));
        self::assertFalse(Schema::hasTable('support_tickets'));
        $migration->up();
        $message = SupportMessage::factory()->create();
        self::assertNotNull($message->customer_id);
        self::assertTrue(Schema::hasColumn('support_tickets', 'closed_at'));
    }

    /**
     * Создаёт подтверждённый independent customer.
     *
     * @return User
     */
    private function customer(): User
    {
        return User::factory()->web()->verified()->create();
    }

    /**
     * Создаёт operator через factory существующей MoonShine auth model.
     *
     * @return MoonshineUser
     */
    private function operator(): MoonshineUser
    {
        if (!MoonshineUserRole::query()->whereKey(1)->exists()) {
            MoonshineUserRole::factory()->create(['id' => 1]);
        }
        return MoonshineUser::factory()->create();
    }

    /**
     * Возвращает валидный независимый submission intent.
     *
     * @return array<string, string>
     */
    private function payload(): array
    {
        return ['subject' => 'Не получается подключиться', 'body' => 'Нужна помощь с настройкой.', 'submission_id' => (string) Str::uuid()];
    }
}
