<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'training_session_id',
        'training_course_id',
        'trainer_id',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'location',
        'max_participants',
        'schedule_notes',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'start_time' => 'time',
        'end_time' => 'time',
        'max_participants' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the training session this schedule belongs to
     */
    public function trainingSession(): BelongsTo
    {
        return $this->belongsTo(TrainingSession::class);
    }

    /**
     * Get the training course being scheduled
     */
    public function trainingCourse(): BelongsTo
    {
        return $this->belongsTo(TrainingCourse::class);
    }

    /**
     * Get the trainer for this scheduled course
     */
    public function trainer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    /**
     * Get all attendances for this scheduled course
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Get all completions for this scheduled course
     */
    public function courseCompletions(): HasMany
    {
        return $this->hasMany(CourseCompletion::class);
    }

    /**
     * Calculate total scheduled days for this course
     */
    public function getTotalDaysAttribute(): int
    {
        return $this->start_date->diffInDays($this->end_date) + 1;
    }

    /**
     * Check if course is currently active
     */
    public function isCurrentlyActive(): bool
    {
        $now = now();
        return $this->start_date <= $now && $this->end_date >= $now && $this->is_active;
    }

    /**
     * Get attendance percentage for a specific user
     */
    public function getAttendancePercentage(int $userId): float
    {
        $totalDays = $this->total_days;
        $attendedDays = $this->attendances()
            ->where('user_id', $userId)
            ->where('present', true)
            ->count();

        return $totalDays > 0 ? ($attendedDays / $totalDays) * 100 : 0;
    }

    /**
     * Check if user has completed this course (75%+ attendance)
     */
    public function isCompletedByUser(int $userId, float $threshold = 75.0): bool
    {
        return $this->getAttendancePercentage($userId) >= $threshold;
    }
}
