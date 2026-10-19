<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Добавляет email, пароль и устойчивое состояние настройки web-аккаунта.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('username')->nullable()->change();
            $table->integer('chat_id')->nullable()->change();
            $table->string('email')->nullable()->unique();
            $table->string('password')->nullable();
            $table->rememberToken();
            $table->unsignedBigInteger('remnawave_user_id')->nullable()->unique();
            $table->string('provisioning_key', 36)->nullable()->unique();
            $table->string('provisioning_state')->nullable();
        });
        DB::statement('ALTER TABLE users ADD CONSTRAINT users_identity_required CHECK (chat_id IS NOT NULL OR (email IS NOT NULL AND password IS NOT NULL))');
    }

    /**
     * Удаляет web-идентичность после проверки отсутствия несовместимых аккаунтов.
     *
     * @return void
     *
     * @throws RuntimeException
     */
    public function down(): void
    {
        if (DB::table('users')->whereNull('chat_id')->orWhereNull('username')->exists()) {
            throw new RuntimeException('Cannot remove web identity while web-only accounts exist.');
        }
        DB::statement('ALTER TABLE users DROP CONSTRAINT users_identity_required');
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn([
                'email',
                'password',
                'remember_token',
                'remnawave_user_id',
                'provisioning_key',
                'provisioning_state',
            ]);
            $table->string('username')->nullable(false)->change();
            $table->integer('chat_id')->nullable(false)->change();
        });
    }
};
