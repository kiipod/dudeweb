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
        if (!Schema::hasColumn('users', 'trial_expired')) {
            return;
        }

        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('trial_expired');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        if (Schema::hasColumn('users', 'trial_expired')) {
            return;
        }

        Schema::table('users', function (Blueprint $table): void {
            $table->dateTime('trial_expired')->nullable()->after('chat_id');
        });
    }
};
