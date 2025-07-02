<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'status')) {
                $table->enum('status', ['active', 'banned', 'inactive'])->default('active')->change();
            } else {
                $table->enum('status', ['active', 'banned', 'inactive'])->default('active');
            }
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['admin', 'coordinator', 'trainer', 'trainee'])->default('trainee');
            }
        });
        Schema::table('registrations', function (Blueprint $table) {
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending')->change();
        });
        // Add more enum migrations here if you add enums to other models
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('status');
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
        });
        Schema::table('registrations', function (Blueprint $table) {
            $table->string('status')->default('pending')->change();
        });
        // Drop/revert other enum columns if needed
    }
};
