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
        Schema::table('course_contents', function (Blueprint $table) {
            // Check if columns exist before dropping them
            if (Schema::hasColumn('course_contents', 'title')) {
                $table->dropColumn('title');
            }
            if (Schema::hasColumn('course_contents', 'order')) {
                $table->dropColumn('order');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_contents', function (Blueprint $table) {
            $table->string('title')->nullable();
            $table->integer('order')->default(0);
        });
    }
};
