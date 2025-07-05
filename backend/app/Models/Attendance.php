<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_id',       
        'training_course_id',
        'present',             
        'marked_at'            
    ];

    protected function casts(): array
    {
        return [
            'marked_at' => 'datetime',
            'present' => 'boolean',
        ];
    }

    // Relationships
    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }

    public function trainingCourse()
    {
        return $this->belongsTo(TrainingCourse::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Get user through registration
    public function getUserAttribute()
    {
        return $this->registration->user ?? null;
    }

    // Helper methods
    public function isPresent(): bool
    {
        return $this->present === true;
    }

    public function isAbsent(): bool
    {
        return $this->present === false;
    }
}
