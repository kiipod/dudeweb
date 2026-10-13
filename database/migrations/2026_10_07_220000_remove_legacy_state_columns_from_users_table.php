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
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['is_trial', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * Restored values use the former defaults because the removed columns did
     * not contain an authoritative or synchronized lifecycle history.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->boolean('is_trial')->default(true)->after('chat_id');
            $table->enum('status', ['ACTIVE', 'DISABLED', 'LIMITED', 'EXPIRED'])
                ->default('ACTIVE')
                ->after('referrer_user_id');
        });
    }
};
