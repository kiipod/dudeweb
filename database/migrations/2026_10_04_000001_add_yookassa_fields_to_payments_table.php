<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->foreignId('product_id')->nullable()->after('user_id')->constrained('products');
            $table->foreignId('promocode_id')->nullable()->after('product_id')->constrained('promocodes');
            $table->string('yookassa_payment_id')->nullable()->unique()->after('promocode_id');
            $table->string('idempotency_key', 64)->unique()->after('yookassa_payment_id');
            $table->string('source', 16)->after('idempotency_key');
            $table->unsignedSmallInteger('months')->after('source');
            $table->unsignedBigInteger('original_amount')->after('months');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table): void {
            $table->dropForeign(['product_id']);
            $table->dropForeign(['promocode_id']);
            $table->dropUnique(['yookassa_payment_id']);
            $table->dropUnique(['idempotency_key']);
            $table->dropColumn([
                'product_id',
                'promocode_id',
                'yookassa_payment_id',
                'idempotency_key',
                'source',
                'months',
                'original_amount',
            ]);
        });
    }
};
