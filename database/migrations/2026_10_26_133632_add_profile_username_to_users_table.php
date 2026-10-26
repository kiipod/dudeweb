<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Добавляет отдельный ник сервиса без изменения Telegram username.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('profile_username', 32)->nullable()->unique();
        });
    }

    /**
     * Удаляет ники сервиса; Telegram identity сохраняется.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['profile_username']);
            $table->dropColumn('profile_username');
        });
    }
};
