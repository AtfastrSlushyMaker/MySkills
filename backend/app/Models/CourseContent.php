<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'training_course_id',
        'content',
        'type',
    ];

    public function trainingCourse()
    {
        return $this->belongsTo(TrainingCourse::class);
    }
}
