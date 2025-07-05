<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseCompletion extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'training_course_id',
        'completion_percentage',
        'sessions_attended',
        'total_sessions',
        'final_score',
        'completion_notes',
        'started_at',
        'completed_at',
        'certificate_issued',
        'certificate_url',
    ];

    protected $casts = [
        'completion_percentage' => 'decimal:2',
        'final_score' => 'decimal:2',
        'sessions_attended' => 'integer',
        'total_sessions' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'certificate_issued' => 'boolean',
    ];

    /**
     * Get the user who completed the course
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the completed course
     */
    public function trainingCourse(): BelongsTo
    {
        return $this->belongsTo(TrainingCourse::class);
    }

    /**
     * Check if course is fully completed
     */
    public function isCompleted(): bool
    {
        return !is_null($this->completed_at);
    }

    /**
     * Check if completion meets minimum requirements
     */
    public function meetsRequirements(float $minimumPercentage = 80.0): bool
    {
        return $this->completion_percentage >= $minimumPercentage;
    }

    /**
     * Mark course as completed
     */
    public function markAsCompleted(array $additionalData = []): void
    {
        $this->update(array_merge([
            'completed_at' => now(),
            'completion_percentage' => 100.0,
        ], $additionalData));
    }

    /**
     * Generate certificate if eligible
     */
    public function generateCertificate(): void
    {
        if ($this->isCompleted() && $this->meetsRequirements()) {
            // Certificate generation logic here
            $this->update([
                'certificate_issued' => true,
                'certificate_url' => "certificates/{$this->user_id}_{$this->training_course_id}.pdf"
            ]);
        }
    }
}
