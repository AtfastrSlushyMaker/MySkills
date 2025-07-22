<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingCourse extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'duration_hours',
        'training_session_id',
        'created_by',
        'is_active'
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'duration_hours' => 'integer',
        ];
    }

    // Relationships
    public function trainingSession()
    {
        return $this->belongsTo(TrainingSession::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }


    public function contents()
    {
        return $this->hasMany(CourseContent::class, 'training_course_id');
    }

    public function completions()
    {
        return $this->hasMany(CourseCompletion::class, 'training_course_id');
    }

    // Helper methods
    public function getRegistrationsAttribute()
    {
        return $this->trainingSession
            ? $this->trainingSession->registrations()
                ->where('status', 'confirmed')
                ->get()
            : collect();
    }

    public function getTotalRegistrationsAttribute(): int
    {
        return $this->trainingSession
            ? $this->trainingSession->registrations()
                ->where('status', 'confirmed')
                ->count()
            : 0;
    }
}
