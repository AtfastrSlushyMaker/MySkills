<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseCompletion extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'training_course_id',
        'status',
        'completed_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function trainingCourse()
    {
        return $this->belongsTo(TrainingCourse::class);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
