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
        Schema::create('course_completions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('training_session_id')->constrained()->onDelete('cascade');
            $table->foreignId('training_course_id')->constrained()->onDelete('cascade');
            $table->decimal('completion_percentage', 5, 2)->default(0); // 0-100% (calculated from attendance)
            $table->integer('days_attended')->default(0); // Auto-calculated
            $table->integer('total_days')->default(0); // Auto-calculated
            $table->timestamp('started_at')->nullable(); // When first attended
            $table->timestamp('completed_at')->nullable(); // When 75% threshold reached
            $table->timestamps();

            // Ensure one completion record per user per course per session
            $table->unique(['user_id', 'training_session_id', 'training_course_id'], 'completions_unique');
            
            // Indexes for common queries
            $table->index(['user_id', 'completed_at']);
            $table->index(['training_course_id', 'completed_at']);
            $table->index(['training_session_id', 'completed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_completions');
    }
};
