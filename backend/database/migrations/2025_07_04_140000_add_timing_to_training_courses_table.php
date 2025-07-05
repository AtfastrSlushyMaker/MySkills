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
        Schema::table('training_courses', function (Blueprint $table) {
            $table->date('start_date')->nullable()->after('duration_hours');
            $table->date('end_date')->nullable()->after('start_date');
            $table->time('start_time')->nullable()->after('end_date');
            $table->time('end_time')->nullable()->after('start_time');
            $table->string('location')->nullable()->after('end_time');
            $table->foreignId('trainer_id')->nullable()->constrained('users')->onDelete('set null')->after('location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_courses', function (Blueprint $table) {
            $table->dropForeign(['trainer_id']);
            $table->dropColumn([
                'start_date',
                'end_date', 
                'start_time',
                'end_time',
                'location',
                'trainer_id'
            ]);
        });
    }
};
