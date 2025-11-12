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
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')
                ->constrained('orders');
            $table->string('confirmation_url')->nullable();
            $table->string('status')->nullable();
            $table->bigInteger('amount');
            $table->string('currency', 3);
            $table->string('description')->nullable();
            $table->json('metadata')->nullable();
            $table->unsignedInteger('recipient_account_id')->nullable();
            $table->unsignedInteger('recipient_gateway_id')->nullable();
            $table->boolean('refundable');
            $table->boolean('test');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
