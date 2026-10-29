<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Создаёт уникальное opaque приглашение для стабильной remote identity.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('referral_invites', function (Blueprint $table): void {
            $table->id();
            $table->char('token', 40)->unique();
            $table->unsignedBigInteger('remnawave_user_id')->index();
            $table->foreign('remnawave_user_id')->references('remnawave_user_id')->on('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Удаляет таблицу приглашений; существующие referral/reward связи сохраняются.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('referral_invites');
    }
};
