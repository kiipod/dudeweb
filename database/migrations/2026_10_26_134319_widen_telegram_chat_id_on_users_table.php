<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Поддерживает Telegram identifiers за пределами signed int32.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->bigInteger('chat_id')->nullable()->change();
        });
    }

    /**
     * Возвращает int32 только если все существующие ID помещаются в него.
     *
     * @return void
     *
     * @throws RuntimeException
     */
    public function down(): void
    {
        if (DB::table('users')->where('chat_id', '>', 2147483647)->orWhere('chat_id', '<', -2147483648)->exists()) {
            throw new RuntimeException('Telegram IDs do not fit in int32; keep the bigint migration.');
        }
        Schema::table('users', function (Blueprint $table): void {
            $table->integer('chat_id')->nullable()->change();
        });
    }
};
