<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Сохраняет proof и этапы привязки, не сохраняя открытый bearer token.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('telegram_account_links', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('bot_id')->index()->constrained('telegraph_bots')->restrictOnDelete();
            $table->char('token_hash', 64)->unique();
            $table->char('session_hash', 64);
            $table->bigInteger('telegram_chat_id')->nullable()->index();
            $table->string('telegram_username')->nullable();
            $table->boolean('telegram_is_premium')->default(false);
            $table->unsignedBigInteger('telegram_user_id')->nullable();
            $table->string('state')->default('pending');
            $table->json('plan')->nullable();
            $table->string('last_error')->nullable();
            $table->timestamp('expires_at');
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'id']);
            $table->index(['state', 'id']);
        });
        Schema::table('users', function (Blueprint $table): void {
            $table->foreignId('telegram_merge_id')->nullable()->index()->constrained('telegram_account_links')->restrictOnDelete();
        });
    }

    /**
     * Удаляет новые stages; завершённые связи users остаются сохранены.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('telegram_merge_id');
        });
        Schema::dropIfExists('telegram_account_links');
    }
};
