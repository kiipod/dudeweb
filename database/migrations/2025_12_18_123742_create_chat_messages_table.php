<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['welcome', 'welcome_back', 'welcome_ref', 'help', 'partners', 'profile', 'message', 'plans'])
                ->default('message');
            $table->text('text');
            $table->json('placeholders')->nullable();
            $table->enum('status', ['active', 'inactive', 'draft', 'planned'])
                ->default('active');
            $table->dateTime('sent_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
    }
};
