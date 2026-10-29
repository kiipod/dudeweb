<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Добавляет составной индекс пользователя и статуса платежа.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Удаляет составной индекс пользователя и статуса платежа.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->dropIndex(['user_id', 'status']);
        });
    }
};
