<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Добавляет маркеры обработки и целевую дату продления по платежу.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->timestampTz('subscription_expires_at')->nullable()->after('status');
            $table->timestampTz('processed_at')->nullable();
            $table->timestampTz('notified_at')->nullable();
            $table->uuid('processing_token')->nullable();
            $table->timestampTz('processing_started_at')->nullable();
        });

        Schema::table('referral_rewards', function (Blueprint $table): void {
            $table->unique('payment_id');
        });
    }

    /**
     * Удаляет маркеры обработки и целевую дату продления по платежу.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('referral_rewards', function (Blueprint $table): void {
            $table->dropUnique(['payment_id']);
        });

        Schema::table('payments', function (Blueprint $table): void {
            $table->dropColumn([
                'subscription_expires_at',
                'processed_at',
                'notified_at',
                'processing_token',
                'processing_started_at',
            ]);
        });
    }
};
