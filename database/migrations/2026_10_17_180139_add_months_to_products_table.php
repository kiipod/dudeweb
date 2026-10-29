<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Add an explicit period and backfill only known seed labels.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->unsignedTinyInteger('months')->nullable();
        });

        foreach (['1 месяц' => 1, '3 месяца' => 3, '6 месяцев' => 6, '12 месяцев' => 12] as $name => $months) {
            DB::table('products')->where('name', $name)->whereNull('months')->update(['months' => $months]);
        }
    }

    /**
     * Remove the period column; original names and prices remain unchanged.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->dropColumn('months');
        });
    }
};
