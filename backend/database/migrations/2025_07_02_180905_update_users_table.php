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
        $table->string('first_name')->nullable();
        $table->string('last_name')->nullable();
        $table->dropColumn('name'); // Remove the old name column
        // Add or modify other columns as needed
    });
}

    /**
     * Reverse the migrations.
     */
   public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['first_name', 'last_name']);
        $table->string('name')->nullable(); // Optionally restore the name column on rollback
        // Drop other columns if needed
    });
}
};
