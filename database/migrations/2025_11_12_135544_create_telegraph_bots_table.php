<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Создаёт таблицу telegraph_bots.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('telegraph_bots', function (Blueprint $table) {
            $table->id();
            $table->string('token')->unique();
            $table->string('name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Удаляет таблицу telegraph_bots.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('telegraph_bots');
    }
};
