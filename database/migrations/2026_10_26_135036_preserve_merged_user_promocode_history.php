<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Позволяет сохранить использованные промокоды обеих merged identities.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('user_promocodes', function (Blueprint $table): void {
            $table->index('user_id', 'user_promocodes_owner_index');
        });
        Schema::table('user_promocodes', function (Blueprint $table): void {
            $table->dropUnique(['user_id']);
        });
    }

    /**
     * Возвращает legacy uniqueness только если объединённая история не будет потеряна.
     *
     * @return void
     *
     * @throws RuntimeException
     */
    public function down(): void
    {
        if (DB::table('user_promocodes')->select('user_id')->groupBy('user_id')->havingRaw('COUNT(*) > 1')->exists()) {
            throw new RuntimeException('Merged promocode history requires the non-unique owner index.');
        }
        Schema::table('user_promocodes', function (Blueprint $table): void {
            $table->unique('user_id');
        });
        Schema::table('user_promocodes', function (Blueprint $table): void {
            $table->dropIndex('user_promocodes_owner_index');
        });
    }
};
