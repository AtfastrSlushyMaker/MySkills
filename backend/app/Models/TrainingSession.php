<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'coordinator_id',       
        'trainer_id',
        'date',
        'start_time',
        'end_time',
        'location',
        'max_participants',
        'skill_name',
        'skill_description'
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'max_participants' => 'integer',
        ];
    }

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function trainingCourses()
    {
        return $this->hasMany(TrainingCourse::class);
    }

    public function trainer()
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    public function coordinator()
    {
        return $this->belongsTo(User::class, 'coordinator_id');
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    public function sessionCompletions()
    {
        return $this->hasMany(SessionCompletion::class);
    }

    public function feedback()
    {
        return $this->hasMany(Feedback::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }

    // Computed Status Properties (No enum needed!)
    public function getStatusAttribute(): string
    {
        $now = now();
        $sessionStart = Carbon::parse($this->date->format('Y-m-d') . ' ' . $this->start_time->format('H:i:s'));
        $sessionEnd = Carbon::parse($this->date->format('Y-m-d') . ' ' . $this->end_time->format('H:i:s'));

        if ($now->lt($sessionStart)) {
            return 'scheduled';
        } elseif ($now->between($sessionStart, $sessionEnd)) {
            return 'ongoing';
        } else {
            return 'completed';
        }
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'scheduled' => 'Scheduled',
            'ongoing' => 'Ongoing',
            'completed' => 'Completed',
            default => 'Unknown'
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'scheduled' => 'blue',
            'ongoing' => 'yellow',
            'completed' => 'green',
            default => 'gray'
        };
    }

    // Business Logic Methods
    public function isScheduled(): bool
    {
        return $this->status === 'scheduled';
    }

    public function isOngoing(): bool
    {
        return $this->status === 'ongoing';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function canBeEdited(): bool
    {
        return $this->isScheduled();
    }

    public function allowsRegistration(): bool
    {
        return $this->isScheduled() && $this->registrations()->count() < $this->max_participants;
    }

    public function canMarkAttendance(): bool
    {
        return $this->isOngoing() || $this->isCompleted();
    }

    // Additional Helper Methods
    public function getAvailableSpotsAttribute(): int
    {
        return $this->max_participants - $this->registrations()->where('status', 'confirmed')->count();
    }

    public function isFull(): bool
    {
        return $this->available_spots <= 0;
    }
}
