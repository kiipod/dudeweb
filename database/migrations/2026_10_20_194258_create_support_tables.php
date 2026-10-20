<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Создаёт обращения и сообщения с FK, query indexes и author/status checks.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('support_tickets', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->string('subject', 160);
            $table->string('status')->default('OPEN');
            $table->timestamp('closed_at')->nullable();
            $table->timestamp('last_activity_at');
            $table->uuid('submission_id');
            $table->char('submission_hash', 64);
            $table->timestamps();
            $table->unique(['user_id', 'submission_id']);
            $table->index(['user_id', 'last_activity_at', 'id']);
            $table->index(['last_activity_at', 'id']);
        });
        Schema::create('support_messages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('ticket_id')->constrained('support_tickets')->restrictOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('users')->restrictOnDelete();
            $table->foreignId('operator_id')->nullable()->constrained('moonshine_users')->restrictOnDelete();
            $table->text('body');
            $table->uuid('submission_id');
            $table->char('submission_hash', 64);
            $table->timestamps();
            $table->unique(['ticket_id', 'submission_id']);
            $table->index(['ticket_id', 'created_at', 'id']);
        });
        $this->check('support_messages', 'support_author', '((customer_id IS NULL) <> (operator_id IS NULL))');
        $this->check('support_tickets', 'support_status', "((status = 'OPEN' AND closed_at IS NULL) OR (status = 'CLOSED' AND closed_at IS NOT NULL))");
    }

    /**
     * Удаляет только новые support tables в обратном FK порядке.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('support_messages');
        Schema::dropIfExists('support_tickets');
    }

    /**
     * Добавляет CHECK; SQLite использует INSERT/UPDATE triggers вместо ALTER CHECK.
     *
     * @param string $table
     * @param string $name
     * @param string $expression
     *
     * @return void
     */
    private function check(string $table, string $name, string $expression): void
    {
        if (DB::getDriverName() === 'sqlite') {
            $columns = ['customer_id', 'operator_id', 'status', 'closed_at'];
            $condition = preg_replace_callback('/\b(' . implode('|', $columns) . ')\b/', fn(array $match): string => 'NEW.' . $match[0], $expression);
            foreach (['INSERT', 'UPDATE'] as $operation) {
                DB::statement("CREATE TRIGGER {$name}_{$operation} BEFORE {$operation} ON {$table} WHEN NOT {$condition} BEGIN SELECT RAISE(ABORT, '{$name} invariant'); END");
            }
        } else {
            DB::statement("ALTER TABLE {$table} ADD CONSTRAINT {$name} CHECK ({$expression})");
        }
    }
};
