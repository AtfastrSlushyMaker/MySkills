<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update all old statuses to 'active' (except archived)
        DB::table('training_sessions')
            ->whereIn('status', ['created', 'confirmed', 'cancelled'])
            ->update(['status' => 'active']);

        // Change the enum values
        Schema::table('training_sessions', function (Blueprint $table) {
            $table->enum('status', ['active', 'archived'])->default('active')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to old enum values
        Schema::table('training_sessions', function (Blueprint $table) {
            $table->enum('status', ['created', 'confirmed', 'cancelled', 'archived'])->default('created')->change();
        });
    }
};
