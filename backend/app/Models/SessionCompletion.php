<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionCompletion extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_id',
        'training_session_id',
        'overall_completion_percentage',
        'courses_completed',
        'total_courses',
        'final_score',
        'completion_notes',
        'skill_earned',
        'started_at',
        'completed_at',
        'certificate_issued',
        'certificate_url',
    ];

    protected function casts(): array
    {
        return [
            'overall_completion_percentage' => 'decimal:2',
            'final_score' => 'decimal:2',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'certificate_issued' => 'boolean',
        ];
    }

    // Relationships
    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }

    public function trainingSession()
    {
        return $this->belongsTo(TrainingSession::class);
    }

    // Get user through registration
    public function user()
    {
        return $this->hasOneThrough(User::class, Registration::class, 'id', 'id', 'registration_id', 'user_id');
    }

    // Helper methods
    public function isCompleted(): bool
    {
        return !is_null($this->completed_at);
    }

    public function hasCertificate(): bool
    {
        return $this->certificate_issued && !is_null($this->certificate_url);
    }

    public function getCompletionPercentage(): float
    {
        return (float) $this->overall_completion_percentage;
    }

    public function generateCertificate(): string
    {
        // Logic to generate certificate URL
        // This could integrate with a certificate generation service
        if ($this->isCompleted() && !$this->hasCertificate()) {
            $certificateUrl = "certificates/{$this->id}_{$this->registration->user->id}_{$this->skill_earned}.pdf";
            $this->update([
                'certificate_issued' => true,
                'certificate_url' => $certificateUrl
            ]);
            return $certificateUrl;
        }
        
        return $this->certificate_url ?? '';
    }

    public function markAsCompleted(string $skillEarned = null): void
    {
        $this->update([
            'completed_at' => now(),
            'skill_earned' => $skillEarned ?? $this->registration->trainingSession->skill_name,
            'overall_completion_percentage' => 100
        ]);
    }
}
