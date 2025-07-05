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
        Schema::table('session_completions', function (Blueprint $table) {
            // Drop the old unique constraint first
            $table->dropUnique(['user_id', 'training_session_id']);
            
            // Drop the old foreign keys first (before dropping indexes)
            $table->dropForeign(['user_id']);
            $table->dropForeign(['training_session_id']);
            
            // Now drop the indexes
            $table->dropIndex(['user_id', 'completed_at']);
            $table->dropIndex(['training_session_id', 'completed_at']);
            
            // Drop the old columns
            $table->dropColumn(['user_id', 'training_session_id']);
        });

        Schema::table('session_completions', function (Blueprint $table) {
            // Add the new registration_id foreign key
            $table->foreignId('registration_id')->after('id')->constrained()->onDelete('cascade');
            
            // Add new unique constraint and indexes
            $table->unique(['registration_id']); // One completion per registration
            $table->index(['registration_id', 'completed_at']);
            // Note: skill_earned index already exists from table creation
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('session_completions', function (Blueprint $table) {
            // Drop the new constraint and indexes
            $table->dropUnique(['registration_id']);
            $table->dropIndex(['registration_id', 'completed_at']);
            
            // Drop the new foreign key
            $table->dropForeign(['registration_id']);
            $table->dropColumn('registration_id');
        });

        Schema::table('session_completions', function (Blueprint $table) {
            // Restore the old columns
            $table->foreignId('user_id')->after('id')->constrained()->onDelete('cascade');
            $table->foreignId('training_session_id')->after('user_id')->constrained()->onDelete('cascade');
            
            // Restore old constraints and indexes
            $table->unique(['user_id', 'training_session_id']);
            $table->index(['user_id', 'completed_at']);
            $table->index(['training_session_id', 'completed_at']);
        });
    }
};
