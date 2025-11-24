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
        Schema::create('referrals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('level', ['basic', 'advanced'])
                ->default('basic');
            $table->foreignUuid('parent_id')
                ->nullable()
                ->constrained('users');
            $table->foreignUuid('user_id')
                ->constrained('users');
            $table->foreignUuid('ref_id')
                ->constrained('users');
            $table->boolean('is_paid')
                ->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('referrals');
    }
};
