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
        Schema::table('attendances', function (Blueprint $table) {
            // Remove the redundant attendance_date field if it exists
            if (Schema::hasColumn('attendances', 'attendance_date')) {
                $table->dropColumn('attendance_date');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            // Restore the attendance_date field
            $table->date('attendance_date')->after('training_course_id');
        });
    }
};
