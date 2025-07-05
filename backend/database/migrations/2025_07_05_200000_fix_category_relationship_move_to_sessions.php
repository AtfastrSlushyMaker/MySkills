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
        // Step 1: Remove category_id from training_courses
        Schema::table('training_courses', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });

        // Step 2: Remove training_course_id from training_sessions and add category_id
        Schema::table('training_sessions', function (Blueprint $table) {
            $table->dropForeign(['training_course_id']);
            $table->dropColumn('training_course_id');
            
            // Add category_id to training_sessions
            $table->foreignId('category_id')->after('id')->constrained('categories')->onDelete('cascade');
        });

        // Step 3: Add training_session_id to training_courses (reverse the relationship)
        Schema::table('training_courses', function (Blueprint $table) {
            $table->foreignId('training_session_id')->after('id')->constrained('training_sessions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse the changes
        Schema::table('training_courses', function (Blueprint $table) {
            $table->dropForeign(['training_session_id']);
            $table->dropColumn('training_session_id');
            
            // Add category_id back to training_courses
            $table->foreignId('category_id')->after('description')->constrained('categories')->onDelete('cascade');
        });

        Schema::table('training_sessions', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
            
            // Add training_course_id back to training_sessions
            $table->foreignId('training_course_id')->after('id')->constrained('training_courses')->onDelete('cascade');
        });
    }
};
