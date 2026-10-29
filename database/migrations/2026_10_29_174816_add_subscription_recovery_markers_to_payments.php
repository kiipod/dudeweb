<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Keeps the observed source and confirmed application of a payment mutation.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->timestampTz('subscription_source_expires_at')->nullable();
            $table->timestampTz('subscription_applied_at')->nullable();
        });
    }

    /**
     * Removes recovery metadata; prefer forward fixes once processing has begun.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->dropColumn(['subscription_source_expires_at', 'subscription_applied_at']);
        });
    }
};
