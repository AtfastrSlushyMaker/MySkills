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
        Schema::create('course_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_session_id')->constrained()->onDelete('cascade');
            $table->foreignId('training_course_id')->constrained()->onDelete('cascade');
            $table->foreignId('trainer_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Course timing within the session
            $table->date('start_date');
            $table->date('end_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('location')->nullable();
            $table->integer('max_participants')->nullable(); // Override course default
            
            // Schedule metadata
            $table->text('schedule_notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Prevent duplicate course in same session
            $table->unique(['training_session_id', 'training_course_id']);
            
            // Indexes for common queries
            $table->index(['training_session_id', 'start_date']);
            $table->index(['training_course_id', 'start_date']);
            $table->index(['trainer_id', 'start_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_schedules');
    }
};
