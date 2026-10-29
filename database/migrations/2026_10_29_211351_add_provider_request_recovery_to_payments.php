<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Stores immutable request and explicit creation reconciliation evidence.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->json('provider_request')->nullable();
            $table->timestampTz('provider_request_expires_at')->nullable();
            $table->timestampTz('provider_creation_failed_at')->nullable();
            $table->json('creation_resolution')->nullable();
        });
    }

    /**
     * Removes creation recovery data; deployed processing should prefer a forward fix.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->dropColumn(['provider_request', 'provider_request_expires_at', 'provider_creation_failed_at', 'creation_resolution']);
        });
    }
};
