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
        Schema::create('session_completions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('training_session_id')->constrained()->onDelete('cascade');
            $table->decimal('overall_completion_percentage', 5, 2)->default(0); // 0-100% (calculated from course completions)
            $table->integer('courses_completed')->default(0); // How many courses completed
            $table->integer('total_courses')->default(0); // Total courses in session
            $table->decimal('final_score', 5, 2)->nullable(); // Optional final session score/exam
            $table->text('completion_notes')->nullable(); // Optional notes from coordinator/trainer
            $table->string('skill_earned')->nullable(); // The skill name earned (e.g., "JavaScript", "Project Management")
            $table->timestamp('started_at')->nullable(); // When first course was started
            $table->timestamp('completed_at')->nullable(); // When session completion threshold reached
            $table->boolean('certificate_issued')->default(false);
            $table->string('certificate_url')->nullable();
            $table->timestamps();

            // Ensure one completion record per user per session (one skill per session)
            $table->unique(['user_id', 'training_session_id']);
            
            // Indexes for common queries
            $table->index(['user_id', 'completed_at']);
            $table->index(['training_session_id', 'completed_at']);
            $table->index(['skill_earned', 'completed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('session_completions');
    }
};
