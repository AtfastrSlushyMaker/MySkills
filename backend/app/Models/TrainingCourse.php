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
        'max_participants',
        'training_session_id',
        'created_by',
        'is_active'
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'duration_hours' => 'integer',
            'max_participants' => 'integer',
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

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
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
