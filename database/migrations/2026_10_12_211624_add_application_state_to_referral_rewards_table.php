<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('referral_rewards', function (Blueprint $table): void {
            $table->string('status')->default('legacy');
            $table->timestampTz('remote_expires_at_before')->nullable();
            $table->timestampTz('target_expires_at')->nullable();
            $table->timestampTz('applied_at')->nullable();
            $table->timestampTz('last_attempted_at')->nullable();
            $table->unsignedInteger('attempts')->default(0);
            $table->text('last_error')->nullable();
            $table->index(['status', 'id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('referral_rewards', function (Blueprint $table): void {
            $table->dropIndex(['status', 'id']);
            $table->dropColumn([
                'status',
                'remote_expires_at_before',
                'target_expires_at',
                'applied_at',
                'last_attempted_at',
                'attempts',
                'last_error',
            ]);
        });
    }
};
