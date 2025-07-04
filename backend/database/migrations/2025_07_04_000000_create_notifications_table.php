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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type'); // 'course_reminder', 'session_update', 'registration_confirmed', etc.
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable(); // Additional data like course_id, session_id, etc.
            $table->string('priority')->default('normal'); // 'low', 'normal', 'high', 'urgent'
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->string('action_url')->nullable(); // URL to navigate when clicked
            $table->string('icon')->nullable(); // Icon for the notification
            $table->timestamp('expires_at')->nullable(); // Optional expiration
            $table->timestamps();

            // Indexes for performance
            $table->index(['user_id', 'is_read']);
            $table->index(['user_id', 'created_at']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
