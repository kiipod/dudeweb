<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Allows shared campaigns; service row locks preserve usage idempotency.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('user_promocodes', function (Blueprint $table): void {
            $table->index('promocode_id', 'user_promocodes_campaign_index');
        });
        Schema::table('user_promocodes', function (Blueprint $table): void {
            $table->dropUnique(['promocode_id']);
        });
    }

    /**
     * Refuses rollback that would discard already shared campaign usage.
     *
     * @return void
     *
     * @throws RuntimeException
     */
    public function down(): void
    {
        if (DB::table('user_promocodes')->select('promocode_id')->groupBy('promocode_id')->havingRaw('COUNT(*) > 1')->exists()) {
            throw new RuntimeException('Shared campaign usage requires the non-unique campaign index.');
        }
        Schema::table('user_promocodes', function (Blueprint $table): void {
            $table->unique('promocode_id');
            $table->dropIndex('user_promocodes_campaign_index');
        });
    }
};
