<?php

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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('username');
            $table->integer('chat_id')->unique();
            $table->boolean('is_trial')->default(true);
            $table->dateTime('trial_expired')->nullable();
            $table->boolean('is_premium')->default(false);
            $table->boolean('is_free')->default(false);
            $table->unsignedBigInteger('referrer_user_id')->nullable();
            $table->enum('status', ['ACTIVE', 'DISABLED', 'LIMITED', 'EXPIRED'])->default('ACTIVE');
            $table->enum('tags', ['TRIAL', 'ACTIVE', 'INACTIVE', 'FRIENDS', 'FAMILY']);
            $table->timestamp('welcome_back_shown_at')->nullable();
            $table->string('state')->nullable();
            $table->json('state_payload')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
